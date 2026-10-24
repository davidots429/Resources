---
title: 데이터 수집·표준화와 추적
---

조리 데이터는 하나의 숫자가 아니다. 그 숫자를 보낸 소스, 장비와 배치, 발생·수신 시각, 원래 단위, 변환 규칙, 품질 판정이 함께 있어야 운영자가 조리 결과를 설명할 수 있다. 그래서 이 영역은 **원천을 잃지 않고 수집 → 순서 복원 → 표준화 → 품질 판정 → 업무 연결**을 수행한다. 실제 장비가 없는 개인 프로젝트에서는 세 가상 제조사 fixture가 다양한 원천 표현을 제공한다. 합성 필드와 값은 실제 제조사 사양으로 소개하지 않는다.[^dcd][^sad]

## 장비 메시지가 들어오기 전

시스템 관리자는 장비와 소스를 등록한다. `device_id`는 플랫폼 장비의 식별자이고 제조사·모델·장비 유형은 별도 기준정보다. 한 장비가 제공하는 값과 통신 방식은 [장비 기능 프로파일](data/mock-profiles-fixtures.md)로 설명한다. 어떤 제조사 자료에서 값을 확인했는지, 표준에서 도출했는지, 시험을 위해 합성했는지를 구분하지 않으면 Mock의 성공을 실제 장비 호환성으로 잘못 해석하기 쉽다.[^dcd]

현재 수집 경로는 읽기 전용 REST HTTPS GET Polling, MQTT 5.0 구독, OPC UA Binary의 Browse·Read·Subscription, 프로젝트 Mock의 OPC UA JSON Session-less Browse·Read다. 실시간 인터페이스가 없다면 UTF-8 JSON·CSV·JSON Lines 파일이나 운영자 입력을 사용한다. 수집 방식이 다르더라도 뒤의 업무 서비스가 동일한 장비·시간·값 의미를 읽도록 만드는 것이 표준화 계층의 역할이다. [수집 기능](data/device-data-collection.md)과 [파일 계약](data/device-data-collection.md#실패와-책임-경계)에서 각 경로의 제약을 확인할 수 있다.[^dcd]

Mock은 21개 프로파일 계열에 `vendor-a`, `vendor-b`, `vendor-c`를 결합해 최소 63개 인스턴스를 제공한다. 세 fixture는 명명, 중첩 구조, 온도·시간·속도 단위, 시각, Boolean, 상태 코드와 Null 표현을 달리한다. 예를 들어 °F 온도는 °C로 결정적으로 바꿀 수 있지만 `rpm`, 상대 출력 `%`, 단계값 `level`은 별도 관계식 없이 같은 속도로 환산할 수 없다. 어댑터가 모르는 값을 임의 추정하지 않도록 [fixture 설계](data/mock-profiles-fixtures.md)와 [표준화 규칙](data/data-standardization.md)을 함께 읽는다.[^code]

## 수신 기록과 사건의 순서

수집 어댑터는 원천 payload를 받은 즉시 소스·장비·스키마 버전·수신시각과 연결된 수신 기록을 만든다. `ingestion_event_id`는 이 수신 **한 건**의 ID다. 같은 업무 레코드가 재전송돼도 새 수신 건은 별도로 보존한다. `business_dedup_key`는 업무상 같은 레코드인지, `payload_hash`는 내용이 같은지를 판단하는 별도 값이다. 같은 키에 다른 내용이 들어오면 원본 하나를 덮는 대신 충돌 Finding을 남긴다. 해시의 정규화와 실제 유일성 제약은 구현체 검증이 남아 있다.[^sad][^dev]

이벤트에 sequence가 있다면 `source + device + batch` 범위에서 순서를 확인한다. 누락 순번을 최대 5초 기다린 뒤 복원하거나 결손으로 확정하고, 만료 뒤 도착한 이벤트는 `LATE_AFTER_GAP` 후보로 분리한다. SQS FIFO는 복원된 순서를 장비별 `MessageGroupId`로 보존한다. FIFO의 전달 특성이 중복 판정을 대신해 주지는 않으므로 Consumer는 재수신·재처리에도 같은 업무 결과를 중복 생성하지 않아야 한다. 구현할 때는 [시간축과 파생 버전](data/temporal-derived-views.md)과 [오류 시뮬레이션](data/mock-error-scenarios.md)을 함께 시험한다.[^sad]

## 원천값에서 업무값으로

표준화 Worker는 원천 스키마를 먼저 검증하고, 장비·모델·버전과 조건에 맞는 매핑 규칙을 선택한다. 명칭·단위·상태 코드를 표준 Data Element로 바꾼 뒤 표준 스키마도 검증한다. 적용 규칙과 원천 필드는 결과에 연결한다. 규칙이 없거나 같은 우선순위가 겹치면 조용히 임의 선택하지 않는다. 원천 payload, 최초 표준화 결과와 재처리 후 결과는 별개 버전이다. 이것이 매핑 규칙을 수정해도 당시의 판단을 재현할 수 있는 이유다.[^code][^dev]

값이 물리적으로 가능하지만 통계적으로 이례적이면 `WARNING`으로 남겨 파이프라인을 통과시킨다. 스키마 위반이나 확정 센서 이상처럼 신뢰할 수 없으면 격리한다. 공정 목표 온도에서 벗어난 유효 측정값은 데이터 오류로 버리지 않고 조리 공정의 `WARNING` 또는 `FAILED` 판단에 사용한다. 품질 판정과 공정 판정을 구분해야 원인을 분석할 수 있다. 재처리는 담당자의 검토·승인을 거쳐 새 Attempt와 파생 버전을 만들고 원본 판정은 보존한다. 상세 절차는 [데이터 품질](data/data-quality.md)과 [검토·재처리](data/quality-review-reprocessing.md)에 있다.[^srs]

## 저장할 때 어떤 모델을 읽는가

`DCD`는 데이터가 **어디서·누가·언제·어떻게** 수집되는지, 코드북은 값의 **의미·단위·코드**, ERD는 논리 Item Entity Type의 관계, 테이블 정의서는 DynamoDB의 물리 저장과 접근 패턴을 다룬다. 이 네 가지를 결합해 구현할 뿐, 하나를 다른 하나의 대체물로 사용하지 않는다. 예를 들어 `device_id`의 수집 책임은 DCD에서, 코드값과 Null 의미는 코드북에서, 장비와 사건의 관계는 ERD에서, PK·SK와 조회 방식은 테이블 정의서에서 확인한다.[^dcd][^code][^erd][^table]

현재 물리 설계는 개인정보 원문 `identity_vault`, 목적별 연결 `link_capsule`, 확정 과금 `billing_ledger`, 복원 재삭제 `deletion_registry`를 별도 경계로 제안한다. `resequencer`, AI Claim Payload와 Ingestion DLQ Manifest도 별도 후보가 있다. 그러나 업무 데이터의 단일/다중 테이블 여부, 여러 PK·SK와 GSI, capacity는 `TBD`다. DynamoDB에는 물리 외래키나 자동 조인이 없으므로 업무 참조와 tenant 소유권은 애플리케이션에서 검사하고 삭제 제한·무결성 점검으로 보완한다. [저장과 추적](data/data-storage-traceability.md)은 원본·표준·파생 결과를 연결하는 개발 관점의 설명이다.[^table][^erd]

새 데이터 필드를 추가할 때에는 출처와 수집 주체, 단위와 값 유형, 적용할 장비 프로파일, 원천·표준 스키마 버전, 품질 범위, 업무 사용처, 보존·삭제, 조회 패턴을 순서대로 확인한다. 필드명만 DCD에 넣거나 DynamoDB Attribute만 추가하면 매핑·평가·감사에서 그 값의 의미를 잃는다.

## 이 영역의 하위 문서

- **수집과 시험:** [장비 데이터 수집](data/device-data-collection.md), [Mock 장비](data/mock-device-simulator.md), [가상 제조사 fixture](data/mock-profiles-fixtures.md), [오류 시나리오](data/mock-error-scenarios.md).
- **값의 해석:** [표준화와 코드 매핑](data/data-standardization.md), [데이터 품질](data/data-quality.md), [품질 검토·재처리](data/quality-review-reprocessing.md).
- **시간과 저장:** [수집 상태](data/collection-monitoring.md), [시간축·파생 버전](data/temporal-derived-views.md), [데이터 저장·추적](data/data-storage-traceability.md).

[^dcd]: [데이터 수집 정의서 DCD v0.6](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_DCD_v0.6.xlsx), 소스·수집 방식·주기·담당.
[^sad]: [시스템 아키텍처 정의서 SAD v0.3](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SAD_v0.3.pdf), 수집에서 품질까지의 흐름.
[^dev]: [개발표준정의서 v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Development_Standards_v0.4.pdf), 이벤트·멱등성·원본 보존 규칙.
[^code]: [코드북 v0.2](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Codebook_v0.2.xlsx), 값 유형·코드·단위·Null 의미.
[^srs]: [요구사항 명세서 SRS v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SRS_v0.7.pdf), 품질·재처리 요구.
[^erd]: [ERD v0.2](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_ERD_v0.2.pdf), Item 관계와 참조 경계.
[^table]: [테이블 정의서 v0.2](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Table_Definition_v0.2.xlsx), 물리 테이블과 접근 패턴.
