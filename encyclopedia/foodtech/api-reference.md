---
title: API와 장비 연계 계약
---

API는 화면, Business API, 수집 어댑터, Mock, AI Gateway가 서로 무엇을 보내고 어떤 결과를 기대할지 정하는 계약이다. 현재 확정된 것은 **읽기 전용 장비 연계 방식과 공통 처리 원칙**이다. 업무 REST 리소스의 실제 URI·요청/응답 스키마·상태 코드·페이징 한도는 아직 확정된 독립 API 명세가 아니다. 따라서 아래의 `/api/v1`은 개발표준의 경로 **권고**이지, 배포된 endpoint가 아니다. 미정인 값을 가짜 예시로 채우지 않고, 구현 전에 필요한 계약을 이 페이지와 관련 [기능 문서](README.md)에 추가한다.[^sad][^dev]

## 수집 경계: Mock에서 플랫폼으로

REST Mock은 HTTPS GET Polling과 OAuth 2.0 Client Credentials를 사용한다. 어댑터가 주기적으로 읽으며 장비에 명령을 보내지 않는다. MQTT Mock은 MQTT 5.0·TLS·QoS 1·Topic ACL로 구독한다. QoS 1은 중복 수신이 가능하므로 수신 건과 업무 중복을 별도로 판단한다. OPC UA Binary는 Client/Server UA-TCP의 SignAndEncrypt, Browse·Read·Subscription만 사용한다. OPC UA JSON은 HTTPS의 Session-less Browse·Read를 사용하는 프로젝트 Mock 계약이다. 어느 경로에도 쓰기나 Method 호출을 넣지 않는다. 실제 제조사 API 호환성을 주장하지 않으며 endpoint, topic, session·timeout·retry, 인증서와 Subscription 값은 기술검증 후 확정한다.[^sad][^dcd]

수집 어댑터가 만든 `ingestion_envelope`에는 원천 payload 또는 그 보존 위치, 소스·장비·batch, 수신시각, 스키마 버전과 수신 건 ID가 연결돼야 한다. 파싱 실패한 데이터에 표준 이벤트 ID를 지어 붙이지 않는다. sequence는 `source + device + batch` 범위에서 복원하고 5초 결손을 판정한다. `ingestion_event_id`는 수신 건, `business_dedup_key`는 업무상 중복, `payload_hash`는 내용 비교용이다. 이 세 식별자를 하나로 합치면 재전송과 내용 충돌을 구별할 수 없다. 상세 데이터 흐름과 상태는 [데이터와 수집](data.md)에 있다.[^sad][^dev]

## 파일 수집의 확인 순서

UTF-8 JSON·CSV·JSON Lines를 허용한다. JSON Lines는 한 줄에 레코드 하나를 두고 각 레코드에 schema version, batch·record·sequence·device ID를 포함한다. 압축은 HTTP `Content-Encoding: gzip` 스트림만 허용하며 zip·첨부 gzip·다중 압축은 거부한다. 압축 해제 후 최대 10,000,000 bytes와 데이터 레코드 10,000개다. CSV 헤더는 레코드 수에 넣지 않는다. UTF-8 BOM은 스트림 시작에서만 제거한다.[^dcd][^srs]

처리는 압축·인코딩 → 파일 문법 → 원천 스키마 → 레코드 경계와 필수 ID → 표준화·품질의 순서다. 파일 전체 구조를 신뢰할 수 없으면 전체를 거부한다. JSON 배열 원소, CSV·JSONL처럼 레코드 경계를 믿을 수 있으면 오류 레코드만 격리하고 정상 레코드는 적재한다. CSV 셀이 `=`, `+`, `-`, `@`, 탭 또는 캐리지리턴으로 시작하면 수식 삽입 위험으로 해당 행을 격리한다. 이 규칙은 음수 CSV도 막으므로 예외 승인 전에는 JSON·JSONL을 사용한다. 파일 해시, batch ID와 중복 키를 함께 기록해 재전송 때 기존 정상 레코드를 덮지 않는다.[^srs]

## 화면과 업무 서비스 사이

고객·관리자 웹은 Business API를 통해 조리작업, 장비 현황, 레시피 후보와 승인, 평가, 분석, 사용자·설정을 사용한다. 화면에서 메뉴를 숨겨도 서버가 사용자 역할과 tenant·매장 소유권을 요청마다 다시 검증해야 한다. 생성·승인·재처리처럼 재전송될 수 있는 명령에는 멱등성 키를 사용한다. 오류 응답은 기계가 읽는 코드, 사람이 이해하는 메시지와 trace ID를 분리하고 비밀값·원천 payload를 싣지 않는다. 목록은 cursor 페이징을 권고하되 limit 상한은 미결정이다. 상태 변화가 필요한 화면에는 서버→클라이언트 단방향 SSE를 설계했지만 상세 재연결 규칙은 아직 정하지 않았다.[^dev][^ia]

업무 API를 하나 구현할 때는 목적과 호출 화면, 사용자 역할·tenant 범위, 입력의 의미·필수값·단위, 성공·오류 결과, 생성되는 업무 사건, 멱등성 범위, 페이지·정렬, 스키마 버전과 재시도 가능성을 한 계약으로 작성한다. `CookingJob` 완료를 예로 들면 단순히 “완료 성공”만 반환할 수 없다. 작업 상태 전이가 가능한지, 마지막 측정이 `STALE`인지, 완료 기록과 인양시각이 다른지, 안전판정은 아직 미산출인지가 다른 질문이다. 실제 URI·필드 이름은 관련 UML·화면·데이터 설계와 함께 확정하고 그때 계약시험을 추가한다.[^uml]

## AI Gateway 경계

일반 서비스는 공급자 키를 복호화하거나 외부 모델을 직접 호출하지 않는다. 요청은 작업 ID와 만료정보만 큐에 싣고 암호화된 Claim Check에 본문을 둔다. Worker는 모델 활성·Tier·비용 한도·외부 전송 정책을 검사한 후 Gateway에 전달한다. 결과는 구조화 출력 스키마와 프롬프트·모델 버전을 함께 보존한다. 최초 시도와 최대 2회 재시도 뒤에도 실패하면 최소 메타데이터만 DLQ로 보낸다. AI Gateway 내부 인증, 모델 레지스트리 스키마, 요청·응답의 구체 형식은 확정해야 할 계약이다.[^sad][^dev]

## 계약을 채울 때 사용할 하위 문서

- [장비 데이터 수집](data/device-data-collection.md), [Mock fixture](data/mock-profiles-fixtures.md), [표준화](data/data-standardization.md): 원천 입력과 변환.
- [조리작업](cooking/cooking-workflow.md), [품질평가](cooking/cooking-quality-evaluation.md): 상태·판정·수정 명령.
- [레시피 승인](ai/recipe-lifecycle.md), [모델·자격증명](ai/ai-model-credential-usage.md): AI 결과와 보안 경계.
- [웹 화면](operations/web-dashboard.md), [권한](operations/access-control.md): 화면별 호출자와 오류 상태.

[^sad]: [시스템 아키텍처 정의서 SAD v0.3](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SAD_v0.3.pdf), 인터페이스 요약과 미확정 항목.
[^dev]: [개발표준정의서 v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Development_Standards_v0.4.pdf), API·이벤트·멱등성·AI 표준.
[^dcd]: [데이터 수집 정의서 DCD v0.6](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_DCD_v0.6.xlsx), 소스와 수집 방식.
[^srs]: [요구사항 명세서 SRS v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SRS_v0.7.pdf), 파일 수집과 오류 처리.
[^ia]: [IA/Storyboard v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_IA_Storyboard_v0.4.pdf), 고객·관리자 화면과 상태.
[^uml]: [UML 설계서 v0.3](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_UML_Design_v0.3.pdf), 조리·평가·AI 시퀀스.
