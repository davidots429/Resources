---
title: 개발 환경과 첫 작업
---

이 프로젝트에서 현재 재현 가능한 실행 환경은 `Resources`의 **백과·자료실 사이트**다. Foodtech 제품의 Backend·Frontend·Mock 실행 저장소, 프레임워크 버전과 로컬 서비스 부트스트랩은 아직 구현 계약이 정해지지 않았다. 따라서 “제품 서버 실행” 명령을 만들어 적을 수는 없다. 대신 새 개발자가 지금 확인할 수 있는 환경, 구현 작업에 들어가기 전 확인할 경계, 첫 기능을 준비하는 순서를 구분한다.[^dev]

## 백과 사이트를 로컬에서 실행하기

`/home/davidots/문서/Resources`에서 Node.js 22.12.0 이상과 npm 9.6.5 이상을 준비한다. 프로젝트 루트에는 `package.json`과 lockfile이 있다. `foodtech` 원 프로젝트 디렉터리는 분석·설계 원본을 보관하며 여기서 `npm run dev`를 실행하지 않는다.

```sh
cd /home/davidots/문서/Resources
npm ci
npm run dev
```

터미널에 표시된 포트와 `/Resources/` 접두 경로를 그대로 브라우저에서 연다. 예를 들어 서버가 4321 포트를 출력했다면 사이트는 `http://localhost:4321/Resources/`, 백과는 `http://localhost:4321/Resources/foodtech/`다. 포트가 점유되면 Astro가 다른 포트를 출력할 수 있으므로 이전 주소를 재사용하지 않는다. 작업 후에는 실행한 터미널에서 `Ctrl+C`로 종료하고, 포트 충돌이 나면 남아 있는 개발 서버가 있는지 확인한다. 과거에 `/foodtech/`로만 접속해 404가 났던 이유는 배포 base가 `/Resources`이기 때문이다.[^site]

문서 원본은 `encyclopedia/foodtech/`에 있다. 이 백과는 `architecture.md`, `data.md`, `cooking.md`, `ai.md`, `operations.md`를 상위 문서로 두고 같은 이름의 폴더에 세부 기능 문서를 둔다. `files/foodtech/`에는 고객 제공 원본과 PDF 변환본, 발표 자료가 있다. 사이트 route는 `src/content.config.ts`, Markdown 링크 변환은 `src/plugins/rewrite-local-markdown-links.mjs`, 사이드바는 `astro.config.mjs`에서 만든다. `public/foodtech/files/`는 동기화 결과이므로 직접 수정하지 않는다.

변경 후 `npm run build`를 실행한다. 이 명령이 자료실 파일을 동기화하고 55개 안팎의 정적 경로와 검색 색인을 `dist/`에 만든다. 새 문서를 추가했다면 빌드 성공뿐 아니라 상위 문서의 링크, 하위 문서의 상위 맥락, 각주가 가리키는 실제 파일, `/Resources/` 경로를 확인한다. `dist/`, `.astro/`, `node_modules/`는 생성물이므로 커밋하지 않는다.[^site]

## Foodtech 제품 기능을 맡았을 때

첫 단계는 화면부터 만드는 것이 아니라 입력과 결과의 의미를 좁히는 일이다. 예를 들어 “볶음·교반 Mock 이벤트 수집”을 맡았다면 다음 순서로 준비한다.

1. [프로젝트 상태](project-status.md)에서 제안·확정·보류를 구분하고, [시스템 구조](architecture.md)에서 `MOCK-001`, `ING-001`, `SEQ-001`, `MAP-001`, `DQ-001`의 책임을 확인한다.
2. [데이터와 수집](data.md)에서 원천 형식과 순번·중복·품질을 읽고, [fixture](data/mock-profiles-fixtures.md)와 [오류 시나리오](data/mock-error-scenarios.md) 중 작업 대상 하나를 고른다. DCD의 Source·수집주체·주기와 코드북의 값 의미를 확인한다.
3. 입력의 정상·누락·중복·역순·연결 단절 예시, 표준화 뒤 기대 결과, 격리 여부, 원본 보존 조건을 계약시험으로 적는다. 아직 없는 endpoint·topic·PK는 `TBD`로 표시하고 결정 담당과 시험 조건을 남긴다.
4. [개발 규칙](development-conventions.md)에 맞춰 I/O adapter와 도메인 규칙을 분리한다. 실제 장비 호환성이나 클라우드 처리량을 로컬 Mock 시험으로 통과했다고 주장하지 않는다.

조리·AI·화면 작업도 같은 방식으로 [상위 영역 문서](README.md)에서 업무 흐름을 먼저 읽고 하위 기능, [API 계약](api-reference.md), 권한과 품질·보안 경계를 확인한다. 이 순서는 산출물 전체를 매번 다시 읽지 않아도 필요한 설계 이유와 연결 관계를 파악하도록 만든 진입 경로다.

## 제품 런타임에 대해 아직 정할 것

Mock 제어의 주 언어는 C#이고, Backend는 Python, 웹은 TypeScript를 권고한다. 그러나 .NET·Python·웹 프레임워크의 구체 버전, 단일/복수 저장소 구조, 로컬 DynamoDB·큐 대체 환경, 비밀값 주입, 초기 데이터, 실제 테스트 명령과 배포 도구는 확정되지 않았다. 구현을 시작할 때 선택 이유, 설치·시작·중지 명령, 환경변수 **이름과 의미**(비밀값 자체 제외), fixture 적재, 테스트, 실패 시 복구를 이 페이지 또는 해당 모듈의 하위 문서에 기록해야 한다. 빈칸을 임의 명령으로 채우면 다음 개발자가 재현할 수 없다.[^dev]

로컬 시험은 합성 fixture만 사용한다. 실제 키·인증서·개인정보를 문서·로그·커밋에 넣지 않고 외부 AI 호출이 필요하면 [모델·자격증명 정책](ai/ai-model-credential-usage.md)을 통과한다. Git의 add·commit·push는 사용자가 직접 수행한다.

[^dev]: [개발표준정의서 v0.4](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_Development_Standards_v0.4.pdf), 기준 언어·계층·미확정 실행 환경.
[^site]: [Resources 사이트 설정](https://github.com/davidots429/Resources/blob/main/package.json), Node·npm·Astro 실행 명령. 배포 base는 [Astro 설정](https://github.com/davidots429/Resources/blob/main/astro.config.mjs)에 있다.
