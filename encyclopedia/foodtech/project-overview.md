---
title: 프로젝트 소개와 범위
---

Foodtech AI Recipe Agent의 출발점은 여러 조리 장비에서 나오는 데이터가 서로 달라 같은 메뉴의 결과를 비교하거나 레시피를 개선하기 어렵다는 문제다. 플랫폼은 원천 데이터를 수집·표준화하고, 매장 조건과 조리 결과를 연결해 운영자가 사용할 수 있는 레시피와 권장 조리조건을 제안한다. 이 개인 프로젝트는 공개 입찰자료의 사업 요구를 참고하되 실제 장비가 없는 환경에서 검증 가능한 범위로 재구성했다.[^rd]

## 누구를 위한 시스템인가

현장 운영자는 작업과 장비 상태, 조리 결과와 권고를 보고 실제 적용 여부를 결정한다. 관리자와 프로젝트 수행자는 장비·매장 프로파일, 수집 오류, 권한, AI 모델과 감사 기록을 관리한다. 개발자는 고객 화면, 관리자 화면, 별도의 Mock 제어 프로그램과 그 뒤의 데이터 처리를 구현한다. 화면별 책임은 [웹 화면](operations/web-dashboard.md)에, 사람별 접근 경계는 [권한](operations/access-control.md)에 있다.[^ia]

## 입력에서 개선까지

장비·파일·운영자 입력은 [데이터 수집](data/device-data-collection.md)과 [표준화](data/data-standardization.md)를 거친다. 운영자는 [조리작업](cooking/cooking-workflow.md)의 계획·진행·평가를 기록한다. 플랫폼은 결과를 [분석](cooking/performance-analytics.md)하고 [레시피 개선](ai/learning-data-improvement.md) 후보를 제안한다. AI가 만든 권고는 검토 대상이지 장비 제어 명령이 아니다.

이 경계는 안전과 책임을 분리하기 위한 결정이다. 개인 프로젝트가 실제 장비에 자동으로 값을 적용하면 제조사 계약과 현장 안전을 검증해야 하지만, 현재는 이를 확인할 장비와 권한이 없다. 따라서 장비 연계는 읽기 전용으로 두고 운영자가 권고를 승인한 뒤 현장에서 적용한다.[^rd]

## 개인 프로젝트의 검증 환경

실물 장비 대신 공개자료를 참조해 만든 가상 제조사 `vendor-a/b/c`와 Mock 프로파일을 사용한다. 공개되지 않은 제조사 API나 스키마는 추정한 실제 사양으로 표현하지 않는다. 대표 메뉴는 돈까스, 제육볶음, 고등어구이 정식이며 각각의 [조리 시나리오](cooking/cooking-scenarios.md)를 통해 수집, 판정, 평가, 권고까지 시험한다. 합성 수치와 품질 기준은 실제 식품 안전기준이나 제조사 규격으로 일반화할 수 없다.[^srs]

[^rd]: [요구사항 정의서 RD v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_RD_v0.7.docx), 프로젝트 목적과 제외 범위.
[^ia]: [메뉴 구성도 및 화면 정의서 IA/Storyboard v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_IA_Storyboard_v0.4.docx), 화면 범위와 역할.
[^srs]: [요구사항 명세서 SRS v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SRS_v0.7.docx), Mock·현장 검증 요구사항.
