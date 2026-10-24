# 프로젝트 백과와 자료실

이 저장소는 여러 프로젝트의 개발자 문서와 고객 제공 산출물을 프로젝트별로 관리한다. 백과는 새 팀원의 참여와 진행 과정 공유에, 자료실은 원본 문서와 웹 열람에 사용한다.

## 콘텐츠

- [프로젝트 백과](encyclopedia/README.md)
- [프로젝트 자료실](files/README.md)

## 개발 환경

사이트는 Astro와 Starlight를 사용하여 정적 파일로 빌드한다. Node.js 22.12.0 이상과 npm 9.6.5 이상이 필요하다. 처음 설치할 때는 lockfile과 일치하도록 `npm ci`를 사용한다.

```shell
npm ci
npm run dev
```

정적 빌드와 빌드 결과 미리보기는 다음 명령을 사용한다.

```shell
npm run build
npm run preview
```

개발 서버와 미리보기의 사이트 경로는 `/Resources/`다. Foodtech의 새 팀원용 시작 문서는 [개발 환경 구축](encyclopedia/foodtech/development-setup.md)에서 확인한다.
