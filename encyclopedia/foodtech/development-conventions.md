---
title: 코드·데이터·시험의 공통 규칙
---

서로 다른 어댑터와 화면이 같은 장비 사건을 다르게 해석하면 나중에 조리 판정을 재현할 수 없다. 이 프로젝트의 개발 규칙은 코딩 스타일을 맞추는 데서 끝나지 않고 **시간, 단위, 식별자, 원본·파생 버전, 권한**의 의미를 서비스 전체에서 일치시키기 위한 것이다. 보안·법적 요구와 SRS가 개발표준과 충돌하면 그 순서로 먼저 검토하고, 임의로 지역 규칙을 우선하지 않는다.[^dev]

## 책임을 나누는 기준

HTTP/SSE·화면 adapter인 `presentation`은 입력·출력 형식을 다룬다. `application`은 “조리작업 완료”, “레시피 후보 승인” 같은 사용 사례를 조정하고 저장·외부 호출은 port를 통해 요청한다. `domain`은 상태 전이, 평가 계산, 범위 판정 같은 업무 규칙을 소유하며 표준 라이브러리 외의 인프라 구현에 의존하지 않는다. `infrastructure`는 DynamoDB, SQS, 공급자 SDK와 프로토콜 연계를 구현한다. 실제 디렉터리명과 저장소 개수는 미결정이지만 이 의존 방향은 유지한다. 수집 프로토콜이 바뀌어도 공정판정 시험을 다시 쓰지 않도록 하기 위한 구조다.[^dev]

소스 파일은 UTF-8 BOM 없음, LF 줄바꿈, 마지막 줄 개행을 사용한다. Python 모듈·함수·변수는 `snake_case`, 클래스는 `PascalCase`, TypeScript 변수·함수는 `camelCase`, 타입·컴포넌트는 `PascalCase`, C#의 공개 타입·메서드는 `PascalCase`, 지역 변수는 `camelCase`를 사용한다. DynamoDB 테이블·Attribute는 `snake_case`를 권고한다. REST 리소스는 소문자 복수 명사와 kebab-case, 이벤트 타입은 `UPPER_SNAKE_CASE`, 환경변수도 `UPPER_SNAKE_CASE`다. 이 표기는 권고된 이름 형식이지 `/api/v1/cooking-jobs`가 이미 확정된 실제 endpoint라는 뜻은 아니다.[^dev]

## 시각과 수치를 저장할 때

시각은 UTC로 저장하고 화면에서 사용자 시간대로 변환한다. `event_occurred_at`은 현장에서 사건이 일어난 시각, 수신시각은 플랫폼이 받은 시각, `effective_time`은 업무상 효력이 생긴 시각, system time은 기록이 저장·대체된 시각이다. 늦게 도착한 센서 사건을 수신시각 기준으로 조리 단계에 끼워 넣거나, 나중에 수정된 평가를 당시의 최초 평가처럼 보이면 안 된다. [시간축과 파생 버전](data/temporal-derived-views.md)이 이 구분을 설명한다.[^dev]

온도·시간·질량·금액·품질 계산은 부동소수점 오차가 판정 경계에 영향을 줄 수 있으므로 Decimal 계열을 사용한다. Python의 `Decimal`은 문자열에서 만들고 float에서 직접 만들지 않는다. 기본 측정값 저장의 논리형은 `DECIMAL(12,4)`이며 실제 DynamoDB 표현과 정밀도는 값 유형별 설계에서 확인한다. `rpm`, `%`, `level`을 동일한 회전속도로 환산하지 않는 것처럼 값 유형·단위·범위는 [데이터와 수집](data.md)의 코드 의미를 따른다.[^dev][^code]

## API와 사건의 불변성

API 입력에서 스키마 버전, 필수 식별자, 단위와 권한을 검증한다. 생성·승인·재처리 명령에는 멱등성 키를 사용하고 오류를 사용자 입력, 도메인 규칙 위반, 외부 연계, 일시 오류로 구별한다. 오류 응답은 기계 코드·사용자 메시지·trace ID를 가지되 비밀값과 원천 payload는 넣지 않는다. Consumer는 at-least-once 전달과 중복을 가정한다. `ingestion_event_id`, `business_dedup_key`, `payload_hash`를 각기 수신 건·업무 중복·내용 비교에 사용하고 처음 받은 원본이나 최초 판정을 덮지 않는다.[^dev]

원천 JSON은 JSON Schema, XML은 XSD, CSV는 프로젝트 열 스키마로 검증한다. 원천 스키마와 표준 스키마를 같은 것으로 취급하지 않는다. 스키마와 매핑 규칙에는 버전을 붙이고, 변경 시 forward-only migration과 복구 runbook을 함께 계획한다. DynamoDB에는 외래키가 없으므로 참조 대상의 존재·소유권 검사와 삭제 제한은 애플리케이션 책임이다. 물리 PK·SK·GSI는 [접근 패턴](data.md)을 먼저 승인한 다음 확정한다.[^dev][^table]

## 언어별 작업과 시험

Python의 공개 함수에는 입력·반환 타입을 명시하고 timezone-aware `datetime`만 받는다. Black·Ruff·mypy·pytest 계열을 권고하지만 최종 버전과 조합은 구현 시작 시 고정한다. TypeScript는 `strict`를 사용하고, 승인된 경계 adapter 밖에서는 `any`를 쓰지 않는다. 화면의 API DTO를 그대로 UI 상태 모델로 사용하지 않으며 접근성 라벨, 키보드 이동과 필드별 오류 메시지를 갖춘다. C# Mock에서는 fixture의 원천 형식 생성과 시나리오 제어를 분리하고, C/C++ 경계가 필요해지면 입력·출력·오류·메모리 소유권을 계약으로 먼저 적는다.[^dev]

단위시험은 상태 전이, 단위 변환, 중복·재처리, 평가 산식처럼 외부 서비스 없이 재현되는 도메인 규칙부터 작성한다. 프로토콜과 공급자 경계는 Mock·계약시험을 사용한다. 모델이나 프롬프트 변경에는 Golden Dataset 회귀시험을 연결하고, 구조화 출력 파싱 실패·만료·최대 2회 재시도·비동의 Tier 전환을 확인한다. AWS KMS 권한, DynamoDB 조건부 쓰기, 실제 장비 호환성은 로컬 단위시험만으로 통과했다고 보고하지 않는다. CI 커버리지·정적분석 임계치는 테스트 계획에서 확정한다.[^dev]

## 보안과 리뷰

AI 키·인증서·개인정보를 코드, 환경파일, 로그와 큐 메시지에 평문으로 두지 않는다. 서비스별 IAM Role은 deny-by-default이고 AI 키 복호화는 Gateway만 허용한다. 로그는 구조화 JSON과 trace ID를 사용하면서 원문 ID, API 키, 프롬프트를 마스킹한다. 프롬프트 원문과 이벤트 감사는 별도 저장·권한 경계다. 코드 리뷰에서는 기능뿐 아니라 스키마·비용·보안·삭제 범위를 확인한다. PR 1인 리뷰와 Conventional Commits 계열은 권고이지만 정확한 제품 저장소 정책과 CI 게이트는 저장소를 마련할 때 결정한다.[^dev]

처음 작업하는 개발자는 [시스템 구조](architecture.md)에서 담당 모듈을 찾고, 해당 [데이터](data.md)·[조리](cooking.md)·[AI](ai.md)·[운영](operations.md) 하위 문서를 읽은 뒤 [API 계약](api-reference.md)의 미결정 값을 확인한다. 이 순서가 기술 선택만 복사해 업무 의미를 빠뜨리는 일을 막는다.

[^dev]: [개발표준정의서 v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Development_Standards_v0.4.pdf), 공통 코드·API·AI·보안·시험 규칙.
[^code]: [코드북 v0.2](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Codebook_v0.2.xlsx), 값 유형·단위·코드.
[^table]: [테이블 정의서 v0.2](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Table_Definition_v0.2.xlsx), 접근 패턴과 물리 설계 미결정 항목.
