# AGENTS.md

## UI/Design 작업 규칙

- 이 프로젝트에서 UI를 수정하거나 새 화면을 만들 때는 반드시 `docs/design-system.md`를 먼저 확인한다.
- 색상, 타이포, 여백, 라운드, 모션은 `docs/design-system.md`와 `constants/theme.ts`를 기준으로 맞춘다.
- 서비스 기본 언어는 한국어이며, UI 문자열은 `constants/i18n.ts`를 통해 관리한다.
- 사용자 노출 문구는 `docs/language-guide.md`를 기준으로 작성한다.
- 커밋 메시지를 만들거나 제안할 때는 반드시 `docs/git-commit-policy.md`를 따른다.
- 공통 레이아웃은 가능한 한 `components/design-system/*` 템플릿(`SectionHeader`, `QuickCard`, `WeekCalendar`)을 재사용한다.
- 모든 화면 루트 컨테이너는 `SafeAreaView`로 구성한다.
- 디자인 시스템과 다른 결정이 필요하면, 먼저 `docs/design-system.md`를 업데이트한 뒤 코드 변경을 진행한다.

## 참조 우선순위

1. `docs/design-system.md`
2. `docs/language-guide.md`
3. `docs/git-commit-policy.md`
4. `constants/theme.ts`
5. `constants/spacing.ts`
6. `components/design-system/*`
7. 기존 구현 화면 (`app/(tabs)/home.tsx`, `app/(tabs)/intro.tsx`, `app/(tabs)/meal-plan.tsx`)
8. 라우팅 게이트 (`app/(tabs)/index.tsx`)
