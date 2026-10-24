---
title: AI 권고와 레시피의 생명주기
---

AI는 매장의 메뉴·재료·제공량·장비와 이전 조리 결과를 읽고 레시피 또는 조리조건의 **후보**를 만든다. 후보가 곧 현장 표준은 아니다. 운영자는 근거, 데이터의 완전성, 제약과 변경점을 확인한 뒤 수정·승인·거부한다. 이 프로젝트가 생성과 승인을 나눈 까닭은 모델의 답이 그럴듯해 보여도 장비 능력, 안전 측정, 현장 운영조건과 충돌할 수 있기 때문이다. 승인된 버전만 일반 조리작업의 기준이 되며 장비에 자동 전송하지 않는다.[^rd][^srs]

## 질문과 추천의 입력

요청은 메뉴명 하나만으로 완성되지 않는다. [매장 프로파일](cooking/store-profile.md)의 제공량, 재료·알레르기 조건, 보유 장비와 목표 운영조건을 확인하고, [장비 프로파일](data/mock-profiles-fixtures.md)이 지원하는 측정·설정 항목을 구별한다. 조리 이력은 품질 판정을 통과하고 권한·사용 목적이 맞는 데이터만 입력으로 보낸다. 누락된 센서값을 AI가 임의로 메워 안전 통과나 공정 정상으로 표현해서는 안 된다.[^srs]

[구조화된 레시피 생성](ai/structured-recipe-generation.md)은 자유문장만 돌려주지 않고 단계, 재료, 장비, 조건, 제한사항을 정해진 스키마의 후보로 저장한다. [조건 기반 추천](ai/recipe-recommendation.md)은 기존 승인 레시피와 매장 조건의 적합성을 판단한다. [권장 조리조건](ai/recommended-cooking-conditions.md)은 장비가 표현할 수 있는 온도·시간·속도 등의 값 유형을 확인한다. `rpm`, 상대 출력 `%`, 단계값 `level`은 관계식이 없다면 서로 바꿔 쓰지 않는다. [질의응답](ai/recipe-qa.md)은 답변과 사용한 레시피·데이터 버전, 알 수 없는 부분을 함께 보여준다.[^srs]

## 한 번의 AI 요청이 통과하는 경계

고객 웹의 요청은 Business API에서 사용자·매장 접근 권한을 확인한다. 정책 검사를 통과한 요청은 작업 ID로 큐에 들어가고, 암호화된 본문은 짧은 수명의 Claim Check에 보관된다. `Recommendation Worker`는 모델 선택, 사용량 한도, 전송 가능 데이터와 프롬프트 버전을 확인한다. 실제 공급자 호출은 `AI Gateway`만 수행한다. 일반 업무 서비스가 공급자 키를 읽지 못하도록 등록 서비스에는 암호화·저장 권한만 주고 Gateway에만 사용 시 복호화 권한을 준다. 응답은 출력 스키마로 검증해 후보·설명·모델·프롬프트 버전과 연결한다.[^sad][^dev]

기본 선택 모델은 로컬 Ollama `llama3.1:8b`다. 다른 로컬 모델과 OpenAI·Google·Anthropic 공급자 모델은 사용자가 선택할 수 있지만, 단순한 모델 이름 목록을 허용 정책으로 보지 않는다. 기능별 Tier, 승인·활성 상태, 비용 한도, 외부 전송 정책과 회귀시험을 통과해야 한다. 일반 작업의 허용된 로컬 fallback과 달리 고급 추론 작업을 낮은 Tier로 **자동** 전환하지 않는다. 사용자가 품질 저하, 전송 위치와 예상 비용을 보고 별도 실행에 동의해야 한다. [모델·자격증명 관리](ai/ai-model-credential-usage.md)는 등록에서 재시도·만료까지의 세부 절차를 담는다.[^srs]

## 후보를 업무 결과로 바꾸는 사람의 단계

모델이 생성한 결과는 먼저 구조와 금지 조건을 검사하고 후보 레시피 버전으로 저장한다. 담당자는 원래 레시피와 달라진 재료·단계·권장값, 사용한 데이터의 출처와 누락, 장비 제약을 확인한다. 승인하면 기존 버전을 덮지 않고 새 승인 버전이 이후 조리작업의 기준이 된다. 거부·수정도 사유와 주체를 남긴다. 화면 `SCR-104`가 권고 검토를 담당하고, [레시피 버전 관리](ai/recipe-lifecycle.md)가 승인·배포 범위를 설명한다.[^ia]

조리 결과가 쌓인 뒤에는 [학습데이터 검토](ai/learning-data-improvement.md)가 경고 없는 정상 데이터, 필수 Feature·Label, 중복 제거, 승인 상태를 확인한다. AI가 만든 개선안을 자동 학습이나 자동 배포로 직결하지 않는다. [조리 품질평가](cooking/cooking-quality-evaluation.md) 한 건과 [성과 분석](cooking/performance-analytics.md)의 집계는 신뢰 수준이 다르므로 둘을 같은 확정 근거로 다루지 않는다. 새 후보를 실제로 비교하려면 메뉴·장비·조리량과 레시피 버전이 맞는 집단, 제외건수, 산식 버전을 함께 남긴다.[^srs]

## 구현할 때 먼저 시험할 것

입력 데이터 누락, 미승인 레시피, 장비 미지원 값 유형, 모델 비활성, 사용량 한도 초과, 구조화 출력 파싱 실패, 재시도 소진, 외부 전송 차단을 서로 다른 결과로 만들어야 한다. 실패를 모두 “AI 오류”로 합치면 사용자는 대기·입력 수정·관리자 승인 중 무엇을 해야 할지 알 수 없다. 프롬프트와 모델 변경은 Golden Dataset으로 회귀시험하며, 모델 자체 신뢰도와 플랫폼 데이터 완전성을 별도 필드로 보여준다. 실제 공급자별 의미 품질과 지연은 구현 후 측정해야 한다.[^dev]

## 이 영역의 하위 문서

- **후보 만들기:** [구조화된 레시피 생성](ai/structured-recipe-generation.md), [조건 기반 추천](ai/recipe-recommendation.md), [권장 조리조건](ai/recommended-cooking-conditions.md), [질의응답](ai/recipe-qa.md).
- **사람의 승인과 개선:** [레시피 생명주기](ai/recipe-lifecycle.md), [학습데이터 검토](ai/learning-data-improvement.md).
- **실행 기반:** [모델·자격증명·비용 관리](ai/ai-model-credential-usage.md).

[^rd]: [요구사항 정의서 RD v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_RD_v0.7.pdf), AI의 역할과 운영자 승인 경계.
[^srs]: [요구사항 명세서 SRS v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SRS_v0.7.pdf), 추천·질의응답·모델·학습 조건.
[^sad]: [시스템 아키텍처 정의서 SAD v0.3](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SAD_v0.3.pdf), AI Gateway와 Claim Check 경계.
[^dev]: [개발표준정의서 v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Development_Standards_v0.4.pdf), 프롬프트 버전·회귀시험·보안 규칙.
[^ia]: [IA/Storyboard v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_IA_Storyboard_v0.4.pdf), 권고 검토 화면과 사용자 행동.
