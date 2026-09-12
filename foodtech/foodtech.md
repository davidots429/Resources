--- 
# 문서 전체 테마
theme: default

# 페이지 변환 모션
transition: slide-left

# div class
class: text-center

# 상단 바 타이틀
title: 푸드테크 장비 연계 AI 에이전트 및 통합 데이터 플랫폼 구축 프로젝트
---
<!-- 1페이지 -->

## 푸드테크 장비 연계 AI 에이전트 및 통합 데이터 플랫폼 구축 프로젝트

<br>

### 202647010 김 범 수

---
transition: slide-left
---
<!-- 2페이지 -->

# 문제 사항 정의

<div class="grid grid-cols-2 gap-8 mt-8">

<!-- 왼쪽: 기존 문제점 -->
<div class="p-6 rounded-lg shadow-sm border-l-4 border-red-500">
  <h3 class="font-bold mb-4"> As-Is: 기존 운영의 한계</h3>
  <ul class="space-y-3 text-sm">
    <li><b>파편화된 데이터 규격</b><br>제조사별 통신 프로토콜 및 데이터 스키마 불일치</li>
    <li><b>이기종 장비 연동 불가</b><br>서로 다른 장비 간 최적의 설정값 도출 및 호환 어려움</li>
    <li><b>운영 비효율성 증가</b><br>품질 편차 발생, 높은 운영 비용 및 작업자 노하우 의존도 심화</li>
  </ul>
</div>

<!-- 오른쪽: 해결 방안 -->
<div class="p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
  <h3 class="font-bold mb-4">To-Be: 프로젝트 목표</h3>
  <ul class="space-y-3 text-sm">
    <li><b>규격 통합 및 AI 레시피 추천</b><br>이기종 데이터를 표준화하고 최적의 장비 설정값(레시피) 자동 도출</li>
    <li><b>데이터 기반 자가 개선(고도화)</b><br>생산 이력, 피드백, 오차율 등을 분석해 AI 알고리즘 스스로 개선</li>
  </ul>
</div>

</div>

<!-- 하단 참고 사항 -->
<div class="mt-8 text-center text-xs text-gray-500">
  * 참고: 프로젝트 특성상 일부 실데이터는 안전 및 환경 제약으로 인해 가상(Mock) 데이터로 대체됩니다.
</div>

---
transition: fade
---
<!-- 3페이지 -->

# 프로젝트 주요 기능

<div class="grid grid-cols-2 gap-8 mt-8 text-left">

  <!-- 첫 번째 기능 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 rounded-md text-2xl">📡</div>
      <h3 class="font-bold text-lg m-0">데이터 수집 시뮬레이터</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li>가상 장비 테스트베드 제작 (요구사항 충족)</li>
      <li>하드웨어 직접 제어 대신 제조사 API 기반 <b>Mock Data Simulator</b> 구축 및 연동 검증</li>
      <li>장비 식별, 구동 이력, 조리 온도/시간, 동작 상태 데이터 모듈화</li>
    </ul>
  </div>

  <!-- 두 번째 기능 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 rounded-md text-2xl">🧠</div>
      <h3 class="font-bold text-lg m-0">AI 스마트 레시피 Agent</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li>LLM 활용 자연어 기반 맞춤형 조리 메뉴얼 생성 <br><span class="text-gray-400 pl-5 text-xs">(잔여 식재료 등 상황 반영)</span></li>
      <li>장비의 가용 성능과 스펙 분석 적용</li>
      <li>실행 가능한 조리 변수를 <b>JSON 형태</b>로 구조화하여 반환</li>
    </ul>
  </div>

</div>

---
transition: fade
---
<!-- 4페이지 -->

# 프로젝트 주요 기능

<div class="grid grid-cols-2 gap-8 mt-8 text-left">

  <!-- 세 번째 기능 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 rounded-md text-2xl">🗄️</div>
      <h3 class="font-bold text-lg m-0">통합 표준 데이터베이스 및 관리 모델</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li><b>데이터 레이어 구축:</b> 원천(Raw) ➔ 정제(Refined) ➔ 학습(Train) ➔ 분석(Analytics)</li>
      <li><b>표준화 테이블:</b> 장비 정보, 표준 메뉴얼, 조리 로그, AI 권장값 대비 실제 피드백 매핑</li>
    </ul>
  </div>

  <!-- 네 번째 기능 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 rounded-md text-2xl">✅</div>
      <h3 class="font-bold text-lg m-0">메뉴얼 검증 및 승인 파이프라인</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li>생성된 메뉴얼 라이프사이클 관리 (검토 중 ➔ 승인 ➔ 최종 제공)</li>
      <li>안전 임계치 초과 시 예외 발생/안내를 통한 안전 필터링 적용</li>
    </ul>
  </div>

</div>

---
transition: slide-left
---
<!-- 5페이지 -->

# 프로젝트 주요 기능

<div class="grid grid-cols-2 gap-8 mt-8 text-left">

  <!-- 다섯 번째 기능 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 rounded-md text-2xl">📊</div>
      <h3 class="font-bold text-lg m-0">관리자 반응형 웹 대시보드</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li>장비 연결 현황 및 실시간 구동 <b>모니터링 화면</b> 구축</li>
      <li>AI 레시피 결과 비교 및 수동 입력값 시각화 <b>차트 분석</b> 제공</li>
    </ul>
  </div>

  <!-- 추가할 내용이 있으면 아래에 -->

</div>

---
transition: fade
---
<!-- 6페이지 -->

## 개발 계획

<br>

| 단계 | 주차 | 주요 목표 | 주차별 세부 개발 계획 및 마일스톤 |
| :--- | :--- | :--- | :--- |
| **분석**<br>(1~3주) | 1주 | 요구사항 정의 | 요구사항 ID(PLT, DAT, AIA 등) 기반 기능 분석 및 요구사항 정의서 도출 |
| | 2주 | 데이터 사양 분석 | 이기종 주방 로봇 데이터 형식(JSON/CSV) 수집 사양 분석 및 표준 구조 정의 |
| | 3주 | 기술 스택 및 아키텍처 확정 | AI API 선정, 서버/데이터베이스 아키텍처 모델 연구 및 타당성 검토 |
| **설계**<br>(4~6주) | 4주 | 시스템 상세 설계 | 전체 데이터 흐름 및 모듈간 다이어그램(UML) 설계 |
| | 5주 | 데이터베이스(DB) 설계 | 데이터 레이아웃에 맞춘 표준 데이터 모델(ERD) 및 스키마 명세 작성 |
| | 6주 | API 및 UI/UX 설계 | RESTful API 입출력 설계서 및 웹 대시보드 스토리보드(Figma) 작성 |
| **구현**<br>(7~8주) | 7주 | 데이터 시뮬레이터 개발 | IoT 장비 데이터를 임의 생성 및 전송하는 Mock Data Simulator 개발 |
| | 8주 | AI Agent 핵심 엔진 구축 | 자연어 프롬프트를 분석해 표준 JSON 조리 조건 레시피를 생성하는 모듈 개발 |

<style>
table {
  font-size: 0.9rem; /* 폰트 크기 조절 */
}
th, td {
  padding: 5px 10px !important; /* 셀 여백 축소 */
  line-height: 1.5; /* 줄 간격 축소 */
}
</style>

---
transition: slide-left
---
<!-- 7페이지 -->

## 개발 계획

<br>

| 단계 | 주차 | 주요 목표 | 주차별 세부 개발 계획 및 마일스톤 |
| :--- | :--- | :--- | :--- |
| **구현**<br>(9~11주) | 9주 | 레시피 전주기 관리 개발 | 레시피 검증, 승인, 버전 관리 메커니즘 및 백엔드 로직 구현 |
| | 10주 | 성과 분석 및 고도화 로직 | 피드백 데이터 수집, 추천 정확도 비교 분석 및 통계 알고리즘 구현 |
| | 11주 | Frontend 대시보드 구현 | 반응형 웹 UI 개발(스마트키친 현황판, 시각화 차트) 및 API 엔드포인트 통합 |
| **테스트**<br>(12~13주) | 12주 | 모듈 및 시나리오 테스트 | 데이터 적재 지연, AI 예외 상황 처리 등 예외 케이스 중심 통합 테스트 실행 |
| | 13주 | 최종 사용자 통합 테스트 | 대표 메뉴 시나리오에 따른 데이터 흐름 테스트 및 서비스 품질(UX) 검증 |
| **안정화**<br>(14~15주)| 14주 | 시스템 최적화 및 보안 | 사용자 권한(외식업주/관리자) 분리, 암호화 처리 및 로딩 속도 튜닝 |
| | 15주 | 포트폴리오 패키징 및 배포 | 배포 프로세스 완료 및 GitHub Readme 작성, 포트폴리오 도큐멘테이션 마무리 |

<style>
table {
  font-size: 0.9rem;
}
th, td {
  padding: 5px 10px !important;
  line-height: 1.5;
}
</style>

---
transition: fade
---
<!--8페이지-->

# 주요 산출물

<div class="grid grid-cols-2 gap-8 mt-8 text-left">

  <!-- 첫 번째 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <h3 class="font-bold text-lg m-0">분석 단계</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li><b>요구사항 정의서(SRS)</b><br>과업 총괄표를 개인이 해결할 수 있도록 쪼갠 기능 요구사항 목록</li>
      <li><b>데이터 수집 정의서</b><br>서로 다른 장비 간 최적의 설정값 도출 및 호환 어려움</li>
    </ul>
  </div>

  <!-- 두 번째 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <h3 class="font-bold text-lg m-0">설계 단계</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li><b>시스템 아키텍처 다이어그램</b><br>플랫폼의 인프라 및 기능 계층 구조 시각화 자료</li>
      <li><b>데이터베이스 설계서(ERD)</b><br>정형 및 반정형 데이터(JSON)를 처리하는 ERD 및 스키마 코드</li>
      <li><b>API 명세서</b><br>Swagger 또는 Postman 기반의 API 문서 정의</li>
    </ul>
  </div>

</div>

---
transition: fade
---
<!--9페이지-->

# 주요 산출물

<div class="grid grid-cols-2 gap-8 mt-8 text-left">

  <!-- 세 번째 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <h3 class="font-bold text-lg m-0">구현 단계</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li><b>Github Repository</b><br>프로그램 소스코드 및 빌드/컨테이너(Docker) 가이드</li>
      <li><b>데이터 시뮬레이션 엔진</b><br>테스트용 임의 데이터 생성 파이썬 스크립트 코드</li>
      <li><b>AI 에이전트 프롬프트 템플릿</b><br>구조화된 결과물을 보장하기 위한 AI 프롬프트 설계 리포트</li>
    </ul>
  </div>

  <!-- 네 번째 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <h3 class="font-bold text-lg m-0">테스트 단계</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li><b>통합 테스트 시나리오 및 결과서</b><br>로봇 데이터 연계 및 시나리오 실행 정합성 보고서</li>
      <li><b>오류 관리 대장</b><br>테스트를 통한 에러 발견 및 리펙토링 처리 이력 정리표</li>
      <li><b>API 명세서</b><br>Swagger 또는 Postman 기반의 API 문서 정의</li>
    </ul>
  </div>

</div>

---
transition: slide-left
---
<!--10페이지-->

# 주요 산출물

<div class="grid grid-cols-2 gap-8 mt-8 text-left">

  <!-- 다섯 번째 -->
  <div class="p-6 rounded-lg shadow-sm border border-gray-700">
    <div class="flex items-center gap-3 mb-4">
      <h3 class="font-bold text-lg m-0">안정화 단계</h3>
    </div>
    <ul class="space-y-3 text-sm list-disc list-inside">
      <li><b>최종 포트폴리오 결과보고서</b><br>시스템 기능, 걸계, 주요 트러블 슈팅 경험이 녹아있는 완결형 리포트</li>
      <li><b>사용자 가이드</b><br>플랫폼 구동 방식을 파악할 수 있는 자료</li>
    </ul>
  </div>

  <!-- 추가할 내용이 있으면 아래에 -->

</div>

---
class: text-center
---

# 감사합니다.
