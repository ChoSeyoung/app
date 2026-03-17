# Weaning Diary

이유식 도입부터 식단 추천, 식재료 관리, 기록, 가이드까지 한 흐름으로 연결하는 모바일 앱입니다.

이 프로젝트는 보호자가 아래를 더 쉽게 할 수 있도록 설계되어 있습니다.

- 오늘 무엇을 먹일지 바로 결정하기
- 먹인 식재료와 반응을 빠르게 기록하기
- 주의 식재료와 미도전 식재료를 한눈에 관리하기
- 이유식 시작 전후의 기초 정보를 차분하게 확인하기

## 핵심 기능

### 홈
- 오늘 식단 요약
- 오늘 기록 현황
- 주의 반응 알림
- 지금 해야 할 행동 카드

### 식단
- 오늘 추천 식단
- 주간 계획
- 추천 이유 요약
- 식단 기준 입력/수정
- 식단에서 기록 화면으로 전환

### 기록
- 날짜별 이유식 기록 조회
- 주간/월간 캘린더 탐색
- 기록 상세 확인
- 별도 기록 추가 페이지

### 식재료
- 코어 식재료 마스터
- 상태 관리: `NOT_TRIED / TRIED / CAUTION / ALLERGY`
- 즐겨찾기
- 메모
- 재시도 제안

### 가이드/레시피
- 이유식 시작하기 가이드
- 파트별 챕터 탐색
- FAQ
- 준비물/시작 신호 체크리스트
- 이유식 레시피 목록/상세

### 더보기/운영
- 알림 설정
- 데이터 관리
- 오픈소스 라이선스
- 서비스 이용약관
- 개인정보 처리방침
- 개발 환경 전용 테스트 메뉴

## 기술 스택

- Expo SDK 54
- React Native 0.81
- Expo Router
- Expo SQLite
- AsyncStorage
- TypeScript

주요 라이브러리:

- `expo-router`
- `expo-image`
- `expo-image-picker`
- `expo-notifications`
- `react-native-google-mobile-ads`

## 실행 방법

```bash
npm install
npm run lint
npx expo start
```

자주 쓰는 명령:

```bash
npm run ios
npm run android
npm run web
```

## 현재 화면 구조

### 탭 화면
- `app/(tabs)/home.tsx`
- `app/(tabs)/meal-plan.tsx`
- `app/(tabs)/journey.tsx`
- `app/(tabs)/ingredients.tsx`
- `app/(tabs)/more.tsx`

### 루트/게이트
- `app/(tabs)/index.tsx`: 초기 진입 분기
- `app/(tabs)/intro.tsx`: 온보딩
- `app/_layout.tsx`: 스택 라우트 등록

### 상세/보조 화면
- `app/record-editor.tsx`
- `app/profile-editor.tsx`
- `app/meal-plan-preferences.tsx`
- `app/notification-settings.tsx`
- `app/data-management.tsx`
- `app/weekly-insights.tsx`
- `app/weaning-start-guide.tsx`
- `app/weaning-part-guide.tsx`
- `app/weaning-chapter.tsx`
- `app/weaning-bookmarks.tsx`
- `app/weaning-faq.tsx`
- `app/weaning-readiness-checklist.tsx`
- `app/weaning-supplies-checklist.tsx`
- `app/weaning-recipes.tsx`
- `app/weaning-recipe-detail.tsx`
- `app/open-source-licenses.tsx`
- `app/terms-of-service.tsx`
- `app/privacy-policy.tsx`

## 데이터 구조 요약

### 식재료
- 고정형 `seed` 마스터를 사용합니다.
- 사용자 식재료 직접 추가는 지원하지 않습니다.
- 식재료 메타데이터에는 아래 정보가 포함됩니다.
  - `minStage`
  - `allergyWatch`
  - `observationDays`
  - `nutritionTags`
  - `relatedRecipeIds`

### 기록
- 실제 섭취/반응 데이터는 기록 저장소에서 관리합니다.
- 식단에서 넘어오는 기록 초안(`RecordDraft`)을 별도로 사용합니다.

### 식단
- 식단은 규칙 기반 추천 엔진으로 생성됩니다.
- 프로필, 식재료 상태, 최근 기록 시그널을 함께 사용합니다.

## 문서 맵

### 제품/기획
- [식재료 PRD](/Users/sy/VSCodeProjects/weaning-diary/docs/prd-ingredient-management.md)
- [식단 PRD](/Users/sy/VSCodeProjects/weaning-diary/docs/prd-meal-plan.md)
- [백로그](/Users/sy/VSCodeProjects/weaning-diary/docs/backlog.md)

### 디자인/문구
- [디자인 시스템](/Users/sy/VSCodeProjects/weaning-diary/docs/design-system.md)
- [언어 가이드](/Users/sy/VSCodeProjects/weaning-diary/docs/language-guide.md)

### 협업/운영
- [개발자 협업 가이드](/Users/sy/VSCodeProjects/weaning-diary/docs/developer-collaboration.md)
- [Git 커밋 정책](/Users/sy/VSCodeProjects/weaning-diary/docs/git-commit-policy.md)

### 이미지 운영
- [수동 이미지 프롬프트 킷](/Users/sy/VSCodeProjects/weaning-diary/docs/manual-image-prompt-kit.md)
- [식재료 이미지 체크리스트](/Users/sy/VSCodeProjects/weaning-diary/docs/ingredient-image-checklist.md)

## 개발 원칙

- UI/디자인 작업 전 `docs/design-system.md`를 먼저 확인합니다.
- 사용자 노출 문구는 `constants/i18n.ts`를 통해 관리합니다.
- 모든 화면 루트 컨테이너는 `SafeAreaView` 기준으로 구성합니다.
- 공통 패턴은 `components/design-system/*`를 우선 재사용합니다.
- 커밋 메시지는 `type(scope): 한국어 요약` 형식을 따릅니다.

## 현재 운영 방향

- 식재료는 `코어 식재료 마스터` 중심으로 관리합니다.
- 이미지 생성은 자동 ML 파이프라인이 아니라 수동 검수 기반으로 운영합니다.
- 알림과 광고는 개발/배포 환경 차이를 고려해 점진적으로 사용합니다.
- 의료 판단 도구가 아니라 관찰/기록/정리 도구를 목표로 합니다.
