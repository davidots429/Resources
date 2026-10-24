---
title: Mock 프로파일과 가상 제조사 fixture
---

Mock 프로파일은 실제 장비 없이 장비 유형, 연계 방식과 데이터 형식의 차이를 반복 시험하기 위한 가상 입력 계약이다. 각 프로파일에 `vendor-a`, `vendor-b`, `vendor-c` fixture를 적용해 필드명, 구조, 단위, 코드와 Null 표현이 다른 입력을 만든다.

하나의 JSON 샘플만 사용하면 어댑터가 제조사별 표현 차이와 미지원 필드를 처리하는지 알 수 없다. 실제 제품의 비공개 API를 추정해 모방하면 호환성을 잘못 주장하게 된다.[^basis]

그래서 공개 표준과 장비 자료에서는 개념만 선별하고, 원천 스키마는 명시적인 가상 규칙으로 만든다. 프로파일이 전달 방식과 데이터 형식을, 장비 유형이 표현 대상을, fixture가 제조사별 표현 성향을 담당하게 분리한다.

## 프로파일 구성

프로파일 ID는 `mockprofile-XYZ`를 사용한다. `X`는 연계 방식, `Y`는 장비 유형, `Z`는 데이터 형식을 뜻한다.

| 연계 방식 | 기본 장비 | 볶음·교반 | 콤비오븐 |
| --- | --- | --- | --- |
| REST | JSON, XML | JSON, XML | JSON, XML |
| OPC UA | UA JSON, UA Binary | UA JSON, UA Binary | UA JSON, UA Binary |
| MQTT | JSON, XML, CSV | JSON, XML, CSV | JSON, XML, CSV |

REST 6개, OPC UA 6개, MQTT 9개로 총 21개 계열이다. 각 계열에 fixture 3개를 적용하므로 기본 인스턴스는 최소 63개다. 인스턴스 ID는 `mockprofile-<계열>-<fixture>-<일련번호>` 형식으로 만들고 한 번 부여한 ID를 재사용하지 않는다.

## 가상 제조사 fixture

| 표현 항목 | vendor-a | vendor-b | vendor-c |
| --- | --- | --- | --- |
| 필드명 | camelCase | snake_case | PascalCase·약어 |
| 구조 | 중첩 | 평면 | 혼합 |
| 온도 | °C | °F | °C |
| 시간 간격 | 초 | 밀리초 | 분 |
| 속도 | rpm | % | level 0~10 |
| 시각 | ISO 8601 UTC | Unix ms | ISO 8601 offset |
| Boolean | `true/false` | `0/1` | `"Y"/"N"` |
| 상태 | 문자열 | 정수 코드 | 축약 코드 |
| Null | `null` | 필드 생략 | 빈 문자열 |
| 확장 필드 | 객체 | prefix | 별도 extension 영역 |

동일 fixture의 표현 성향은 연계 방식이 달라도 유지한다. 다만 OPC UA 표준 Node와 명시 단위가 있으면 표준 정의를 우선하고, fixture 차이는 추가 Node와 REST·MQTT 원천 필드에서 재현한다.

## 생성 항목의 출처 구분

- `VERIFIED`는 공개자료에서 직접 확인한 개념이나 값이다.
- `STANDARD_DERIVED`는 채택한 표준에서 도출한 값이다.
- `INFERRED`는 공개정보를 조합해 추론했으나 실제 사양으로 확인되지 않은 값이다.
- `SYNTHETIC`은 시험 목적의 가상 규칙과 값이다.

이 구분은 공개된 참조자료와 생성된 원천 스키마를 혼동하지 않게 한다. 기본 장비는 OPC UA 30200과 DIN/TS 18898:2021-09, 볶음·교반은 I-Robo 2와 BOTINKIT, 콤비오븐은 RATIONAL과 UNOX의 공개 개념을 참조하지만 어느 fixture도 실제 제조사와 일대일 대응하지 않는다.

## 스키마와 표준화 검증

1. JSON은 JSON Schema, XML은 XSD, CSV는 프로젝트 열 스키마로 원천 입력을 검증한다.
2. Adapter가 fixture별 필드, 단위와 코드를 공통 데이터 요소로 변환한다.
3. 제조사 중립 표준 스키마로 변환 결과를 다시 검증한다.
4. 원천 payload, 원천 스키마 버전, Mapping ID와 매핑 버전을 함께 보존한다.
5. 공통 모델에 없는 값은 버리지 않고 제조사 확장 영역에 둔다.

원천과 표준 스키마를 분리하는 이유는 정상 입력의 유효성과 변환 결과의 유효성을 독립적으로 확인하기 위해서다.

## 실패와 책임 경계

- fixture는 실제 제조사 API·프로토콜 호환 구현이 아니다.
- 공개되지 않은 필드명, 코드와 허용범위를 실제 제품 사양처럼 표현하지 않는다.
- 미지원 필드는 `NOT_SUPPORTED`, 이번 수집에서 얻지 못한 값은 `NOT_AVAILABLE`로 구분한다.
- 해석하지 못한 원천 코드는 버리지 않고 `UNMAPPED`와 원천값을 함께 보존한다.
- 비정상 입력을 시험하기 위해 정상 스키마를 완화하지 않는다.
- 실제 필드 목록, endpoint, topic, session과 UA Binary 검증도구는 기술검증 뒤 확정한다.

## 설계 상태와 남은 작업

21개 프로파일 계열, 3개 가상 fixture, 최소 63개 인스턴스, 출처 분류와 변환 전·후 스키마 검증 원칙은 승인됐다. 프로토콜 상세 계약과 실행용 원천 payload는 Mock 구현 착수 전에 확정한다.

## 더 읽기

- [데이터와 수집](../data.md): 이 기능의 상위 흐름과 책임 경계
- [프로젝트 백과](../README.md)
- [Mock 장비 데이터 시뮬레이션](mock-device-simulator.md)
- [Mock 오류 시나리오와 검증](mock-error-scenarios.md)
- [장비 데이터 수집](device-data-collection.md)
- [데이터 표준화와 코드 매핑](data-standardization.md)
- [대표 메뉴별 조리 시나리오](../cooking/cooking-scenarios.md)

[^basis]: [데이터 수집 정의서 DCD v0.6](/Resources/foodtech/files/Foodtech_AI_Recipe_Agent_DCD_v0.6.xlsx), 해당 기능의 요구·설계 기준.
