---
title: 시스템 구조와 구현 경계
---

Foodtech AI Recipe Agent는 장비에서 읽은 사실을 레시피 권고와 운영 판단으로 연결하는 서버 플랫폼이다. 새 개발자가 먼저 구별해야 할 것은 **장비 데이터**, **플랫폼의 판정**, **사람의 승인**이다. 장비의 측정값은 관찰한 사실이고, 공정·품질 판정은 그 사실에 규칙을 적용한 결과다. AI가 제안한 값은 후보이지 승인된 레시피나 장비 제어 명령이 아니다. 운영자가 검토·승인하고 직접 장비를 조작한다. 개인 프로젝트에서는 실제 장비의 안전성과 제조사 계약을 검증할 수 없기 때문에 플랫폼에 제어 권한을 주지 않았다.[^sad][^rd]

## 한 번의 조리가 시스템을 지나는 경로

가상 볶음·교반기의 한 측정 이벤트를 생각해 보자. 별도 C# Mock 프로그램이 가상 제조사 형식의 메시지를 만든다. [수집 어댑터](data/device-data-collection.md)는 REST Polling, MQTT 구독 또는 OPC UA 읽기 방식으로 받아 `ingestion_envelope`에 소스·장비·수신시각·원본 참조를 기록한다. 파싱할 수 없는 입력은 표준 이벤트를 꾸며내지 않고 수신 단계에서 격리한다. 이 어댑터를 실제 제조사 통신 규격의 호환 구현이라고 표현하지 않는다.[^sad]

장비 이벤트는 도착 순서와 발생 순서가 다를 수 있다. [Resequencer](data/temporal-derived-views.md)는 `source + device + batch`의 순번을 5초 동안 복원하고, 누락이 확정되면 `DATA_GAP`을 남긴다. 정렬된 이벤트는 장비별 순서를 유지하는 SQS FIFO를 거쳐 [표준화](data/data-standardization.md)와 [품질 판정](data/data-quality.md)으로 이동한다. 화씨 온도를 섭씨로 바꾸거나 상태 코드를 매핑할 때도 원본과 사용한 규칙 버전을 남긴다. 데이터 품질 경고가 곧 음식의 품질 실패라는 뜻은 아니다.[^sad]

표준 데이터는 [조리작업](cooking/cooking-workflow.md)의 단계와 연결된다. 운영자가 투입·인양·완료를 기록하고, 서비스는 장비 사건과 운영자 사건을 함께 사용해 상태를 계산한다. [공정 판정](cooking/cooking-state-assessment.md), 식품 안전, [운영자 품질평가](cooking/cooking-quality-evaluation.md), AI 권고는 서로 다른 결과로 보존한다. 레시피 후보도 [승인·버전 관리](ai/recipe-lifecycle.md)를 거쳐야 현재 사용 가능한 레시피가 된다. 이를 섞으면 센서 결손을 음식 품질 실패로 잘못 계산하거나 AI 제안을 현장 승인으로 오인할 수 있다.[^srs]

## 프로그램별 책임

아래 이름은 현재의 논리적 책임 경계이지 확정된 프로세스·배포 개수가 아니다.[^sad]

| 경계 | 입력에서 출력까지 맡는 일 |
| --- | --- |
| Collection Adapter · Resequencer | 원천 수신·인증·형식 검증 뒤 장비별 순번을 복원하고 결손을 기록한다. |
| Standardization Worker · Data Quality Engine | 필드·단위·코드를 표준값으로 바꾸고 Finding, 경고, 격리를 결정한다. |
| Cooking Service · Analytics Service | 작업·단계·평가를 연결하고 승인된 산식으로 결과를 집계한다. |
| Business API · Customer/Admin Web | 권한을 확인해 업무를 제공한다. 고객 화면과 관리자 화면의 메뉴·접근 범위는 다르다. |
| Mock Controller / Simulator | 합성 fixture와 시험 시나리오를 별도 UI에서 생성·실행하고 증적을 남긴다. |
| Recommendation Worker · AI Gateway | AI 작업을 큐에서 받아 모델·비용·전송 정책을 검증한다. Gateway만 공급자 키를 복호화한다. |

AI 작업의 SQS 메시지에는 작업 ID와 만료 메타데이터만 싣고, 요청 본문은 암호화된 Claim Check에 둔다. 프롬프트 원문과 이벤트 감사 기록은 서로 다른 저장소·키·역할로 분리한다. 호출을 편하게 만들려고 일반 서비스에 AI 키 복호화 권한을 주면 이 신뢰 경계가 무너진다. 상세 ID와 의존성은 [모듈 설계](architecture/modules.md)에 연결했다.[^sad]

## 기술을 어디에 적용하는가

Mock 생성·제어의 주 언어는 C#이다. C/C++은 C#·.NET이 실행되지 않거나 구형 장비 라이브러리 연동이 필요한 확인된 경계에서만 고려한다. 데이터·AI 백엔드는 Python, 웹은 TypeScript를 권고하지만 구체 프레임워크와 런타임 버전은 아직 확정하지 않았다. AI 호출은 LangChain에서 LiteLLM 어댑터를 거쳐 로컬 Ollama 또는 승인된 외부 모델로 이어지는 설계이며 기본 선택 모델은 Ollama `llama3.1:8b`다. 모델의 선택·대체·비용 정책은 [AI와 레시피](ai.md)에 있다.[^dev]

수집은 프로토콜별 독립 모듈 또는 Task를 가진 하나의 논리 서비스로 설계했다. REST Polling, MQTT Subscribe, OPC UA Client가 모두 외부로 연결을 시작하므로 수집 진입점에 공통 인바운드 Load Balancer를 두지 않는다. ECS Fargate는 배포 후보, DynamoDB는 짧은 순번 복원과 업무 Item의 설계 대상, SQS FIFO는 장비별 순서 보존, S3는 원본·프롬프트·감사 객체의 저장소다. 그러나 리전, 서브넷, 실제 테이블 키·GSI, 용량과 오토스케일은 검증 전 값이다. 로컬 개발, 클라우드 시험, 클라우드 운영도 분리한다.[^sad]

이 백과 사이트는 제품 서버와 별개로 Astro·Starlight를 사용해 GitHub Pages에 배포한다. PDF.js·SheetJS는 산출물 열람용이며 제품 백엔드의 기술 스택이 아니다. 사이트 실행 방법은 [개발 환경 구축](development-setup.md)에 적었다.

## 코드를 나눌 때

개발표준은 `presentation → application → domain`과 `infrastructure → application ports`의 의존 방향을 제안한다. HTTP·SSE·화면 어댑터는 전달 방식을 처리하고, application은 사용 사례의 순서를 조정하며, domain은 장비 상태·조리·평가 규칙을 소유한다. DynamoDB, 큐, 공급자 SDK는 infrastructure에 격리한다. Mock 메시지 형식이나 AI 공급자가 바뀌어도 조리 판정 규칙을 다시 작성하지 않기 위한 경계다. 단일 저장소인지 여러 저장소인지는 아직 미결정이므로 이를 실제 폴더명으로 단정하지 않는다.[^dev]

새 기능을 맡았다면 [현재 진행 상태](project-status.md)에서 확정·보류를 확인하고, 아래 영역 문서의 입력·출력과 하위 기능을 읽는다. 이어서 [API와 연계 계약](api-reference.md)의 권한·멱등성, [개발 규칙](development-conventions.md)의 시험 기준을 확인한다. 아직 상세 URI나 물리 키가 없는 부분은 설계의 빈칸이지 개발자가 임의로 확정해도 되는 값이 아니다.

## 영역별 상세 문서

- [모듈 설계](architecture/modules.md): 프로그램별 책임과 의존 관계.
- [데이터와 수집](data.md): 원천 이벤트, 표준 이벤트, 품질, 저장·재처리.
- [조리와 평가](cooking.md): 작업 상태, 판정, 평가와 분석.
- [AI와 레시피](ai.md): 권고 생성, Gateway, 승인과 버전.
- [운영과 보안](operations.md): 화면, 권한, 개인정보·감사·복구.

[^sad]: [시스템 아키텍처 정의서 SAD v0.3](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SAD_v0.3.pdf), 원칙·데이터 흐름·모듈·배포 구성.
[^rd]: [요구사항 정의서 RD v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_RD_v0.7.pdf), 목적과 장비 제어 제외 범위.
[^srs]: [요구사항 명세서 SRS v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SRS_v0.7.pdf), 조리·추천·승인 경계.
[^dev]: [개발표준정의서 v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Development_Standards_v0.4.pdf), 언어·계층·의존성 원칙.
