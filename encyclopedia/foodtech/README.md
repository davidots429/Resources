---
title: Foodtech AI Recipe Agent
---

Foodtech AI Recipe Agent는 조리로봇·주방장비의 데이터를 수집하고 서로 다른 표현을 같은 의미로 바꾸어, 매장에 맞는 레시피와 조리조건을 **운영자가 판단할 수 있도록** 제안하는 플랫폼이다. 조리 결과와 평가를 다시 기록해 다음 레시피 개선에 사용한다. 이 프로젝트는 공개 사업 요구를 개인 프로젝트로 재구성했으며 실제 장비 대신 합성 Mock을 사용한다. 장비 시작·중지, 설정값 자동 전송, 프로그램 배포는 하지 않는다.[^rd]

이 백과는 개발자가 구현과 검증을 함께 진행하기 위한 작업 지식이다. 고객에게 제공할 약속을 정리한 [분석·설계 산출물](artifacts.md)과 역할이 다르다. 산출물에 이미 있는 내용도 개발자가 기능 사이의 관계를 이해하는 데 필요하면 이곳에 다시 설명한다. 특정 수치와 결정의 출처는 각주로, 더 좁은 주제는 하위 문서 링크로 연결한다.

## 처음 참여한다면

먼저 [프로젝트 소개](project-overview.md)에서 원래 사업 요구, 개인 프로젝트의 범위와 사용자를 읽는다. 이어 [현재 진행 상태](project-status.md)를 확인한다. 분석과 설계는 제안 단계이고 제품 구현은 아직 완료되지 않았다. 문서에 나온 AWS 테이블과 API 경로를 이미 작동하는 코드로 오인하면 안 된다. [개발 환경 구축](development-setup.md)은 지금 실제로 실행 가능한 백과 사이트와, 제품 구현을 시작할 때 확정해야 할 환경을 구분한다.

그다음 [시스템 구조](architecture.md)를 읽는다. 장비 데이터가 들어와 권고와 사람의 승인에 이르기까지 어떤 프로그램이 맡는지 알게 된다. 자신의 작업은 아래 영역 중 하나에서 시작해 하위 기능 문서로 내려간다. 예를 들어 “제육볶음의 센서 결손을 화면에 표시”하는 작업이라면 [데이터와 수집](data.md)의 결손·품질, [조리와 평가](cooking.md)의 판정, [화면·운영](operations.md)의 상태 피드백을 연결해 읽어야 한다. 한 기능은 한 계층 안에서만 완성되지 않는다.

## 구현 영역

### [데이터와 수집](data.md)

Mock 장비, 파일, 운영자 입력이 플랫폼의 사건이 되는 과정이다. 원천 메시지, 순번, 표준값, 품질, 재처리와 저장을 설명한 뒤 [장비 수집](data/device-data-collection.md), [가상 제조사 fixture](data/mock-profiles-fixtures.md), [표준화](data/data-standardization.md) 등 더 좁은 문서로 내려간다.

### [조리와 평가](cooking.md)

매장·장비 조건에서 한 조리작업을 계획하고, 운영자와 장비의 사건을 엮어 상태·안전·품질을 판단한다. [대표 메뉴 시나리오](cooking/cooking-scenarios.md)와 [작업 상태](cooking/cooking-state-assessment.md), [품질평가](cooking/cooking-quality-evaluation.md)가 여기에 속한다.

### [AI와 레시피](ai.md)

승인된 데이터와 매장 조건으로 후보 레시피를 만들고, 모델·자격증명·비용 정책을 통과한 뒤 사람이 검토한다. [레시피 생성](ai/structured-recipe-generation.md), [모델 관리](ai/ai-model-credential-usage.md), [승인·버전](ai/recipe-lifecycle.md)이 하위 문서다.

### [화면·권한과 운영](operations.md)

고객·관리자·Mock 시험 UI의 접근 경계, 오래되거나 일부만 있는 데이터의 표시, 개인정보와 감사, 백업·복구를 다룬다. [웹 화면](operations/web-dashboard.md), [권한](operations/access-control.md), [삭제 수명주기](operations/privacy-pseudonymization-deletion.md)로 이어진다.

## 개발을 진행하며 함께 갱신할 문서

[개발 규칙](development-conventions.md)은 코드·스키마·시험의 공통 기준이다. [API와 연계 계약](api-reference.md)은 현재 확정된 프로토콜과 아직 작성할 업무 API를 구별한다. 용어가 낯설면 [용어 사전](glossary.md)을, 실제 장애나 설계 충돌을 만나면 [문제 해결 기록](troubleshooting.md)을 확인한다. [회의·결정 기록](meeting-notes.md)은 실제 논의와 후속 작업을 연결한다. 새 팀원이 구현만 보고 배경을 추정하지 않도록 결정 이유와 실패 사례를 기능 문서에도 반영한다.

최신 원본과 웹 열람용 사본은 [자료실](/Resources/foodtech/files/)에서 제공한다. 백과의 내용과 산출물이 다르게 보이면 임의로 합치지 말고 [현재 진행 상태](project-status.md)와 해당 기능의 결정 상태를 확인한다.[^sad]

[^rd]: [요구사항 정의서 RD v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_RD_v0.7.pdf), 목표·사용 흐름·제외 범위.
[^sad]: [시스템 아키텍처 정의서 SAD v0.3](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SAD_v0.3.pdf), 현재 설계 경계와 검증 게이트.
