---
title: 조리작업부터 평가와 개선까지
---

이 플랫폼에서 조리작업은 레시피를 실제로 사용한 한 번의 실행 단위다. `CookingJob`이 메뉴, 승인된 레시피 버전, 매장, 장비, 식사배치, 운영자 기록과 장비 사건을 연결한다. 같은 메뉴를 반복 조리해도 작업은 서로 다른 결과를 가진다. 레시피 권장값만 저장하면 현장에서 무엇을 적용했고 결과가 어땠는지 알 수 없으므로, 권장·실제·판정·평가를 작업 ID로 이어서 보존한다.[^rd][^srs]

## 작업을 시작하기 전에

[매장 프로파일](cooking/store-profile.md)에는 제공량, 보유 장비, 운영조건과 제약이 있다. [장비 도입환경](cooking/equipment-adoption-scenario.md)은 어떤 장비를 어떤 역할로 사용할 수 있는지 설명한다. 레시피 후보가 조건에 맞더라도 [승인된 버전](ai/recipe-lifecycle.md)이 아니면 일반 조리작업의 기준으로 쓰지 않는다. 이 검사는 운영자가 잘못된 장비나 미승인 조건으로 작업을 시작하지 않도록 하기 위한 것이다. 화면 `SCR-101`은 메뉴·레시피·장비·배치를 선택하고 준비·예열 조건을 보여준다.[^ia]

대표 시험은 [돈까스·튀김기, 제육볶음·볶음교반기, 고등어구이 정식·콤비오븐](cooking/cooking-scenarios.md)으로 구성한다. 이들은 음식 일반의 안전기준이나 실제 제조사 조리법이 아니라 합성 fixture다. 세 메뉴를 선택한 이유는 온도·시간뿐 아니라 투입 순서, 회전속도, 챔버 모드 전환, 둘 이상의 조리작업을 연결하는 식사배치까지 확인할 수 있기 때문이다. 세부 센서와 수치, 아직 미정인 실행 fixture는 각 시나리오에서 확인한다.[^srs]

## 준비, 진행, 완료를 구별한다

작업 상태는 `PENDING ↔ READY → RUNNING ↔ PAUSED → COMPLETED/FAILED/CANCELED`의 흐름을 가진다. 준비조건이 사라지면 `READY`가 `PENDING`으로 돌아갈 수 있고, 일시정지에서 재개하려면 명시적인 사건이 필요하다. 작업 안의 프로그램 단계는 별도의 `PENDING`, `ACTIVE`, `COMPLETED`, `SKIPPED`, `CANCELED`, `FAILED` 상태를 가진다. 단계 하나를 생략했다고 전체 작업을 완료나 실패로 자동 판정하지 않기 위해 분리했다. [작업 흐름](cooking/cooking-workflow.md)과 [상태·판정](cooking/cooking-state-assessment.md)이 전이와 예외를 자세히 설명한다.[^code]

화면 `SCR-102`에서는 장비 시계열과 사람의 투입·조치 기록을 함께 보여준다. 수집 가능한 상태는 자동으로 들어오지만, 장비가 제공하지 않는 투입·인양·육안 관찰은 운영자 입력으로 남긴다. 수동 기록을 장비 측정처럼 보이게 하면 검증할 수 없는 사건이 생긴다. 화면 `SCR-103`에서는 인양시각과 화면에 완료를 기록한 시각도 구분한다. 플랫폼의 작업 취소나 일시정지 기록은 물리 장비를 멈추는 명령이 아니다.[^ia]

## 완료 후에도 판정은 하나가 아니다

작업이 `COMPLETED`라는 것은 업무 흐름이 끝났다는 뜻이지 식품 안전과 음식 품질까지 모두 통과했다는 뜻이 아니다. 공정 자동판정은 시간·온도·속도 등 유효한 데이터가 목표에 맞았는지 계산한다. 식품 안전판정은 필요한 측정의 유효성과 기준 충족을 확인한다. 운영자 품질평가는 별도의 관찰 결과다. AI 권고의 수락·거부도 독립 상태다. 센서 결손은 판정 근거 부족일 수 있지만 조리 실패와 같은 값으로 저장하지 않는다. [상태·판정 체계](cooking/cooking-state-assessment.md)를 먼저 읽으면 화면과 저장 모델을 잘못 합치지 않을 수 있다.[^srs]

품질평가는 재료 상태, 전처리·손질 적정성, 맛, 식감, 외관, 향·이취, 온도 적합성의 일곱 항목을 각각 1~5점으로 기록한다. 유효 항목 점수 합계를 `5 × 유효 항목 수`로 나눈 백분율이 종합 조리품질 점수다. 전반적 만족도는 참고값이지 이 계산의 입력이 아니다. 안전 문제가 확인되거나 배제되지 않은 배치는 0점으로 섞지 않고 `미산출` 또는 `평가 중단`으로 남긴다. 수정 평가는 이전 값을 덮지 않고 새 버전으로 연결한다. 자세한 입력 검증과 합격·목표 조건은 [품질평가](cooking/cooking-quality-evaluation.md)에 있다.[^srs]

## 다음 레시피로 이어지는 데이터

[권장값과 실제값 비교](cooking/recommendation-actual-comparison.md)는 목표와 현장 적용의 차이를 작업·단계·단위별로 계산한다. [성과 분석](cooking/performance-analytics.md)은 공정 완료율, 안전 실패율, 품질, 재조리와 자원 사용을 분리한다. 분모가 0이거나 필요한 측정이 빠졌으면 0%가 아니라 `미산출`이다. 메뉴·장비·조리량·레시피 및 평가척도 버전이 다른 집단을 한데 묶으면 개선 효과처럼 보이는 착시가 생길 수 있다. 분석은 표본·제외 건수·산식 버전을 결과와 함께 남긴다.[^srs]

분석 결과는 [학습 후보 검토](ai/learning-data-improvement.md)와 새 레시피 후보의 근거가 될 수 있다. 하지만 한 번의 저평가나 상관관계만으로 레시피를 자동 수정하지 않는다. 품질 warning이 없고 필요한 Feature·Label이 채워졌으며 중복 제거된 데이터만 학습 후보로 사용한다. [현장실증](cooking/field-validation.md)은 제안한 변경이 대표 시나리오에서 재현되는지 확인하는 별도의 단계다.

## 이 영역의 하위 문서

- **준비:** [매장 프로파일](cooking/store-profile.md), [장비 도입환경](cooking/equipment-adoption-scenario.md), [대표 조리 시나리오](cooking/cooking-scenarios.md).
- **실행:** [조리계획·진행](cooking/cooking-workflow.md), [작업 상태·판정](cooking/cooking-state-assessment.md).
- **결과:** [권장·실제 비교](cooking/recommendation-actual-comparison.md), [품질평가](cooking/cooking-quality-evaluation.md), [운영성과 분석](cooking/performance-analytics.md), [현장실증](cooking/field-validation.md).

[^rd]: [요구사항 정의서 RD v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_RD_v0.7.pdf), 고객 문제와 업무 흐름.
[^srs]: [요구사항 명세서 SRS v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SRS_v0.7.pdf), 조리·평가·분석 규칙.
[^ia]: [IA/Storyboard v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_IA_Storyboard_v0.4.pdf), `SCR-101~104`의 화면 흐름.
[^code]: [코드북 v0.2](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Codebook_v0.2.xlsx), 작업·단계 상태와 사건 코드.
