# Git Commit Message Policy

목적: 커밋 히스토리를 빠르게 읽고, 변경 의도를 추적하고, 릴리스 노트를 만들기 쉽게 유지한다.

## 1. 기본 형식

모든 커밋 메시지는 아래 형식을 기본으로 사용한다.

```text
<type>(<scope>): <summary>
```

예시:

```text
feat(meal-plan): 오늘 추천 카드에 실제 식단 연결
fix(journey): 기록 상세 팝업 닫힘 플래시 제거
design(tab-bar): 플로팅 pill 정렬과 간격 재조정
docs(design-system): 상단 히어로 카드 규칙 추가
refactor(ingredients): 식재료 저장소 구조 정리
chore(repo): git remote 및 문서 정리
```

## 2. Type 규칙

- `feat`: 사용자 기능 추가
- `fix`: 버그 수정
- `design`: UI/UX 디자인 조정
- `refactor`: 동작은 유지하고 구조만 개선
- `docs`: 문서 수정
- `test`: 테스트 추가/수정
- `chore`: 설정, 스크립트, 의존성, 리포지토리 관리 작업

`style`은 사용하지 않는다. 이 프로젝트에서 시각 스타일 변경은 대부분 `design`으로 분류한다.

## 3. Scope 규칙

scope는 가능한 한 실제 변경 영역을 짧게 적는다.

권장 예시:

- `home`
- `meal-plan`
- `journey`
- `ingredients`
- `more`
- `record-editor`
- `profile-editor`
- `design-system`
- `repo`

여러 영역에 걸치더라도 가장 중심이 되는 범위를 하나만 쓴다.

## 4. Summary 규칙

- 한 줄로 끝낸다.
- 50자 안팎을 권장한다.
- 변경 결과를 바로 이해할 수 있게 쓴다.
- 마침표를 붙이지 않는다.
- `fix bug`, `update`, `change something` 같은 모호한 표현은 금지한다.

좋은 예시:

- `fix(record-editor): 식재료 검색창 하단 radius 조건 정리`
- `design(more): 이유식 시작하기 카드를 최상단으로 이동`

나쁜 예시:

- `fix: bug fix`
- `update ui`
- `change design`

## 5. 본문 규칙

필요할 때만 본문을 추가한다.

본문이 필요한 경우:

- 구조 변경이 큰 경우
- 마이그레이션이 있는 경우
- 트레이드오프 설명이 필요한 경우
- 왜 이렇게 바꿨는지 기록이 필요한 경우

형식:

```text
<type>(<scope>): <summary>

- 무엇을 바꿨는지
- 왜 바꿨는지
- 주의할 점이 있으면 추가
```

## 6. 커밋 분리 원칙

- 하나의 커밋은 하나의 목적만 담는다.
- 기능 추가와 디자인 정리는 가능하면 분리한다.
- 대규모 리팩터링 중간에 동작 변경이 섞이면 커밋을 나눈다.
- 문서 업데이트는 관련 기능 커밋과 같이 갈 수 있지만, 독립 가치가 크면 별도 `docs` 커밋으로 분리한다.

## 7. 금지 사항

- 의미 없는 WIP 커밋을 기본 브랜치로 올리지 않는다.
- `final`, `last`, `진짜최종`, `asdf` 같은 메시지는 금지한다.
- 자동 생성 문구 그대로 사용하지 않는다.
- 여러 성격의 변경을 한 커밋에 억지로 합치지 않는다.

## 8. 권장 예시

```text
feat(home): 오늘 식단 카드에 실제 추천 식단 노출
fix(tab-bar): 선택 pill 내부 정렬과 간격 재분배 수정
design(journey): 캘린더와 선택 날짜 카드 간격 통일
refactor(design-system): 상단 HeroHeaderCard 공통 컴포넌트 추출
docs(git): 커밋 메시지 정책 문서 추가
chore(repo): origin remote 추가
```

## 9. 브랜치와의 관계

- 브랜치는 작업 묶음
- 커밋은 변경 의도

브랜치명이 길어도 커밋 메시지는 짧고 명확해야 한다.

## 10. 이 프로젝트의 기본 판단 기준

이 프로젝트는 UI 변경 비중이 높다. 따라서 아래 기준을 우선 적용한다.

- 화면 동작/사용자 기능이 바뀌면 `feat` 또는 `fix`
- 시각적 조정과 배치 변경이 중심이면 `design`
- 공통 컴포넌트 추출, 구조 정리는 `refactor`
- 디자인 시스템, PRD, 언어 가이드는 `docs`
