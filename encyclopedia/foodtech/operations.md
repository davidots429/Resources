---
title: 화면·권한과 운영 안전장치
---

이 플랫폼의 화면은 장비를 조작하는 제어판이 아니라 운영자가 데이터를 보고 판단을 남기는 작업 공간이다. 고객은 자신의 허용 매장 안에서 챗봇, 조리작업, 레시피, 평가와 분석을 사용한다. 프로젝트 수행자는 별도 관리자 웹에서 장비 프로파일, 수집·품질, 모델 승인, 사용자·매장 권한과 감사를 관리한다. 개발자·시험 담당자의 Mock 제어 프로그램은 또 다른 UI다. 화면을 나눈 이유는 고객 업무, 운영 설정, 합성 시험 송신이 서로 다른 권한과 사고 범위를 갖기 때문이다.[^ia][^sad]

## 사용자가 보는 현재 상태

[고객·관리자 화면](operations/web-dashboard.md)은 결과값만 표시하지 않는다. 장비 값에는 단위, 발생시각, 마지막 수신시각, 실제/합성 출처와 품질 상태가 따라야 한다. 대기, 데이터 없음, 일부만 도착함, `STALE`, `OFFLINE`, 권한 거부와 실패는 각기 다른 화면 상태다. 오래된 값의 색상만 바꾸고 “현재 온도”로 계속 보이면 운영자가 잘못된 결정을 내릴 수 있다. 오류 메시지에는 원인, 영향, 다음 행동과 추적 ID를 넣되 비밀값과 원문 payload는 노출하지 않는다.[^ia]

로그인 뒤 메뉴를 숨기는 것은 사용성 기능이지 보안의 전부가 아니다. Business API는 요청마다 사용자·역할·tenant·매장 범위를 다시 확인한다. 고객에게 관리자 메뉴를 보여주지 않고, 관리자에게 고객의 사적 대화나 외부 AI 키 원문을 기본 제공하지 않는다. 승인·삭제·재처리·권한 변경처럼 영향이 큰 행동은 대상과 변경 내용을 확인하고 감사 사건을 남긴다. 어떤 역할이 어떤 작업을 할 수 있는지는 [인증과 권한](operations/access-control.md)에서 다룬다.[^ia]

## 개인정보와 AI 키의 경계

원문 식별정보는 일반 업무 이벤트에 섞지 않고 `identity_vault`에 격리한다. 업무에는 목적·기간에 맞는 HMAC 가명값을 쓰고, 필요한 연결은 암호화된 `link_capsule` 경계를 통과한다. 가명화는 익명화가 아니다. 연결 수단이 남아 있으면 승인된 목적 아래 재식별이 가능하므로 일반 분석 서비스에 Vault 접근 권한을 주지 않는다. 삭제 요청은 화면의 한 행만 지우는 일이 아니라 원문, 연결, 객체, 캐시, 검색·임베딩과 학습 후보까지 추적하는 절차다. 백업 복원 뒤 삭제 정보가 되살아나지 않도록 Tombstone을 재적용한다. [개인정보 수명주기](operations/privacy-pseudonymization-deletion.md)에 상세 흐름이 있다.[^sad][^table]

외부 AI 키는 등록 서비스가 암호화해 저장하고, AI Gateway만 호출 순간에 복호화한다. 사용자가 키를 넣는 화면은 채팅 위젯과 제삼자 스크립트가 없는 전용 화면이며 전송 후 브라우저 상태에서 평문을 지운다. 외부 공급자에게는 요청 데이터 분류와 전송 정책을 통과한 내용만 보낸다. 이 결정은 AI 기능을 편리하게 쓰면서도 업무 서비스와 관리자 화면에 자격증명이 퍼지지 않게 하기 위한 것이다. 실행과 비용 정책은 [AI 모델 관리](ai/ai-model-credential-usage.md)를 읽는다.[^dev]

## 감사, 보존과 복구

조리 판정 변경, 권고 승인, 개인정보 삭제와 관리자 설정 변경은 “누가 언제 무엇을 바꿨는가”를 남긴다. 이벤트 감사는 S3의 append-only 객체로 기록하고 이전 digest를 잇는 hash chain으로 연속성을 검증하는 설계다. 프롬프트 원문과 감사 객체는 버킷·KMS 키·IAM Role을 분리한다. 단순한 애플리케이션 로그는 감사 원장이나 민감 원문 저장소를 대신하지 않는다. 자세한 사건과 열람 권한은 [감사·데이터 보호](operations/audit-data-protection.md)에 있다.[^sad]

원천·표준 장비 데이터와 프롬프트·피드백 원문은 90일, 접속·오류·수집 로그는 30일, 과금·사용량 상세 사건은 1년 보존한 뒤 삭제하는 기준이다. 최소 Event Audit 증적은 최대 3년이다. 내부 복구 시험 목표는 RPO 1시간, RTO 4시간이며 공급자 SLA가 아니다. Identity Vault·연결 Capsule·과금 원장에는 7일 PITR 복구창을 제안한다. 분기별 격리 환경 복원에서 권한, 삭제 Tombstone 재적용, S3 버전과 감사 연속성을 확인해야 비로소 복구 가능하다고 말할 수 있다. 운영 담당·알림 채널과 실제 성능은 아직 시험·운영 준비가 남았다. [백업·복구](operations/backup-recovery.md)가 절차를 설명한다.[^srs]

신규 운영 담당자는 [교육·안정화](operations/training-stabilization.md)에서 사용자 문의와 오류 접수 경로를 확인하고, 실제 장애를 발견하면 [문제 해결 기록](troubleshooting.md)에 재현 조건·원인·검증 결과를 남긴다. 설계에 적힌 목표를 운영에서 달성했다고 혼동하지 않는 것이 중요하다.

## 이 영역의 하위 문서

- [웹 화면과 통합 현황판](operations/web-dashboard.md): 고객·관리자 업무와 화면 상태.
- [사용자 인증과 역할 권한](operations/access-control.md): 역할·매장 범위와 서버 검증.
- [감사이력과 데이터 보호](operations/audit-data-protection.md), [개인정보 가명화와 삭제](operations/privacy-pseudonymization-deletion.md): 접근·보존·삭제의 책임 경계.
- [백업과 복구](operations/backup-recovery.md), [교육과 안정화](operations/training-stabilization.md): 공개 운영과 장애 대응.

[^ia]: [IA/Storyboard v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_IA_Storyboard_v0.4.pdf), 화면 서비스·역할·공통 상태 규칙.
[^sad]: [시스템 아키텍처 정의서 SAD v0.3](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SAD_v0.3.pdf), 신뢰 경계와 감사 구조.
[^table]: [테이블 정의서 v0.2](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Table_Definition_v0.2.xlsx), Vault·Capsule·Deletion Registry 경계.
[^dev]: [개발표준정의서 v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Development_Standards_v0.4.pdf), 키 취급·로그·UI 보안 규칙.
[^srs]: [요구사항 명세서 SRS v0.7](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_SRS_v0.7.pdf), 보존·복구 기준.
