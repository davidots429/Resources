---
title: 현재 진행 상태
---

프로젝트는 분석 → 설계 → 구현 순서로 진행한다. 분석 산출물은 제안 단계로 정리됐고, 설계 산출물도 제안 초안이다. 2026년 10월 23일 기준 일부 계약과 결정 후보를 로컬에서 점검했지만 실제 제품이 완성되거나 AWS와 장비 연계가 검증된 상태는 아니다.[^sad]

## 지금 사용할 수 있는 기준

[RD](artifacts.md)는 사업 목적과 범위를, [SRS](artifacts.md)는 기능과 검증 조건을 설명한다. [DCD](artifacts.md)는 데이터를 어디서 어떻게 수집하는지 다룬다. 설계에서는 [SAD](architecture.md)가 시스템 경계, [개발표준](development-conventions.md)이 공통 구현 규칙, [IA/Storyboard](operations/web-dashboard.md)가 화면, [UML](architecture.md)이 행위와 구조, [ERD·테이블·코드북](data.md)이 데이터 구조를 맡는다. 최신 버전과 웹 보기·원본 다운로드는 [자료실](/Resources/foodtech/files/)에서 확인한다.

## 아직 검증하지 않은 것

물리 DynamoDB 테이블 경계와 키·인덱스의 적합성, 실제 AWS KMS·STS·SQS 경계, 제조사 통신 계약, 구현 라이브러리의 성능은 구현 후 해당 환경에서 확인해야 한다. 로컬 Python·SQLite 검증은 매핑, 중복, 비파괴 이력, 삭제 후 복원 재삭제 같은 일부 불변 조건이 가능한지 보여준 결과다. 이를 실제 저장소나 분산 환경의 통과 판정으로 옮기지 않는다.[^sad]

구현 중에 확정할 스키마와 실행 계약은 담당 기능을 시작할 때 기록한다. 성능·품질의 수치 임계치는 대표 데이터와 부하 결과가 생긴 뒤, 운영 절차는 공개 데모 전에 정한다. 새 팀원은 작업을 시작하기 전에 관련 기능 페이지에서 `보류`를 확인하고, 결정이 필요한 항목은 [회의·결정 기록](meeting-notes.md)에 연결한다.

[^sad]: [시스템 아키텍처 정의서 SAD v0.3](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SAD_v0.3.docx), 최신 승인 방향과 검증 게이트.
