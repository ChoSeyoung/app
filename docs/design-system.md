# Weaning Diary Design System v1

기준 레퍼런스: 사용자가 제공한 저널 스타일 모바일 UI 이미지(라이트 톤, 라운드 카드, 주간 캘린더, 소프트 탭바).

## 1. Design Principles

1. Calm First
- 배경은 채도를 낮춘 중립 톤을 사용한다.
- 강조는 노란색 1개 축으로 제한한다.

2. Cute by Default
- 이 프로젝트의 기본 인상은 항상 `귀엽고 다정한 이유식 다이어리`여야 한다.
- 귀여움은 캐릭터 일러스트보다 색, 라운드, 작은 장식 요소, 부드러운 문구에서 만든다.
- 카드, 버튼, 칩, 달력 버블은 딱딱하거나 업무용 앱처럼 보이지 않도록 둥글고 말랑한 인상을 유지한다.
- 화려한 화면도 자극적이기보다 사랑스럽고 포근한 방향을 우선한다.

3. Korean-First Copy
- 서비스 기본 언어는 한국어로 유지한다.
- 다국어 확장 시에도 기본 locale은 `ko`를 유지한다.
- UI 문자열은 하드코딩하지 않고 `constants/i18n.ts`에서 관리한다.
- 사용자 노출 문구 톤/형식은 `docs/language-guide.md`를 따른다.

4. Rounded and Soft
- 카드, 칩, 버튼은 둥근 모서리를 기본값으로 사용한다.
- 직선/각진 요소보다 곡선 요소를 우선한다.

5. Scanable Hierarchy
- 화면은 `헤더 -> 날짜 컨트롤 -> 섹션 제목 -> 카드` 순서로 읽힌다.
- 제목 대비 본문은 명확한 크기 차이를 둔다.

6. Fast Capture
- 입력/행동은 탭 이동과 카드 액션으로 빠르게 시작한다.

## 2. Foundation Tokens

현재 코드 기준 토큰 파일: `constants/theme.ts`

### 2.1 Color
- `background`: `#F6F1E8`
- `surface`: `#F4F3F1`
- `surfaceMuted`: `#E3DDD5`
- `text`: `#1c1c1c`
- `icon`: `#1c1c1c`
- `accent`: `#ffb928`
- `accentSoft`: `#F8E6AA`
- `border`: `#DED9D2`

보조 카드 톤(Quick Journal 전용):
- Blush: `#F4D7D0`
- Lavender: `#DCD4F3`
- Cream: `#EEEAD6`

### 2.2 Typography
- Primary family: `Pretendard`
- 규칙: 한글/영문 혼합 포함 모든 UI 텍스트는 Pretendard 사용

권장 스케일:
- Display: 30-32 / 700
- Section Title: 28-32 / 700
- Card Title: 16-20 / 700
- Body: 13-15 / 400-500
- Caption/Meta: 11-13 / 500

### 2.3 Radius
- Screen container/card large: `20-22`
- Card medium: `16-18`
- Chips/date bubbles: `999` (full round)
- Form control radius: `14`
- Primary button radius: `16`

### 2.4 Spacing
- Screen horizontal padding: `18-20`
- Intro/onboarding horizontal padding(컴팩트): `16`
- Section block gap: `14-18`
- Card internal padding: `18` (intro hero/form card 통일)
- Micro gap(text lines): `6-10`

spacing token source: `constants/spacing.ts`
- `screenHorizontal`: 18
- `screenTopPadding`: 20
- `screenBottomPadding`: 24
- `tabScreenBottomPadding`: 88
- `stickyActionContentPaddingBottom`: 88
- `sectionGap`: 16
- `cardStackGap`: 16
- `cardStackGapCompact`: 8
- `sectionHeaderMarginTop`: 6
- `sectionHeaderMarginBottom`: 10
- `cardPadding`: 18
- `fieldGap`: 10
- `microGap`: 6
- `formControlMinHeight`: 44
- `formControlRadius`: 14
- `formControlHorizontal`: 12
- `formControlVertical`: 12
- `formTextareaMinHeight`: 92
- `primaryButtonMinHeight`: 46
- `primaryButtonRadius`: 16
- `compactButtonMinHeight`: 42
- `compactButtonRadius`: 14
- `chipHorizontal`: 12
- `chipVertical`: 8
- `chipRadius`: 999
- `introScreenHorizontal`: 16
- `introTopPadding`: 20
- `introSectionGap`: 14
- `introCardPadding`: 18
- `introCardInnerGap`: 10
- `introInputGap`: 6
- `introStepSpacing`: 10

### 2.5 Shadow
- 일반 카드는 그림자 최소화
- 그림자는 꼭 필요한 강조 카드에만 제한적으로 사용

### 2.6 Form Control Rules
- 기본 입력창, picker field, 검색창은 `minHeight 44 / radius 14 / padding 12`를 사용한다.
- 주요 저장/확정 버튼은 `minHeight 46 / radius 16`을 사용한다.
- 작은 보조 버튼은 `minHeight 42 / radius 14`를 사용한다.
- 선택 칩은 `paddingHorizontal 12 / paddingVertical 8 / radius 999`를 기본값으로 사용한다.
- 화면별로 임의의 `10, 11, 12, 14, 16` 값을 섞지 말고 위 토큰을 우선 사용한다.

### 2.7 Card Vertical Spacing Rules
- 카드와 카드 사이의 기본 세로 간격은 `cardStackGap(16)`를 사용한다.
- 같은 그룹 안에서 카드 간격을 조금만 벌려야 할 때만 `cardStackGapCompact(8)`를 사용한다.
- 섹션 헤더가 카드 블록과 만날 때 상단/하단 보정은 `sectionHeaderMarginTop(6)`, `sectionHeaderMarginBottom(10)`으로 고정한다.
- 화면별로 `marginTop: 6`, `marginBottom: 10`, `marginTop: 8` 같은 하드코딩 값을 새로 만들지 않는다.
- 페이지 루트의 카드 스택은 `contentContainerStyle.gap = cardStackGap`을 기본값으로 사용한다.
- 페이지 마지막 여백은 임의 숫자를 쓰지 않고 아래 규칙만 사용한다.
- 일반 스택/문서 화면: `screenBottomPadding`
- 탭 화면: `tabScreenBottomPadding`
- 하단 고정 버튼 화면: `stickyActionContentPaddingBottom`

## 3. Layout Rules

### 3.1 App Shell
- 최상단부터 콘텐츠 시작 (`SafeAreaView` + content `paddingTop` 20 기준)
- 하단 탭바 구조 유지
- 모든 화면 루트는 `SafeAreaView` 기준으로 구성한다.
- 앱 기본 배경은 `#F6F1E8`를 사용한다.
- 주요 서비스 화면은 평면 단색 배경으로 끝내지 않고, 낮은 채도의 파스텔 오브 2~3개를 배경에 배치한다.
- 배경 오브는 콘텐츠를 방해하지 않도록 `opacity 0.45~0.55`, 큰 원형, 화면 모서리 기준 배치를 사용한다.
- 카드보다 앞에 나오지 않도록 항상 `absolute fill + pointerEvents none` 패턴을 사용한다.

### 3.2 Header
- 좌측: 아기 이름 기반 보호자 웰컴 메시지
- 우측: 사용자가 업로드한 원형 아바타 이미지
- 헤더 아래 주간 캘린더를 바로 배치

### 3.3 Weekly Calendar
- 요일 라벨 + 날짜 원형 버블 2열 구조
- 선택 날짜는 `accent` 배경 사용

### 3.4 Section Header
- 좌: 섹션명 (`My Journal`, `Quick Journal` 등)
- 우: `See all` 텍스트 액션

### 3.5 Hero Area
- 좌측 대형 카드 + 우측 세로 보조 카드
- 대형 카드는 핵심 행동/메시지를 1개만 강조

### 3.6 Quick Cards
- 가로 스크롤
- 파스텔 배경 카드 반복
- 각 카드 하단에 날짜/태그 칩 배치

### 3.7 Bottom Navigation
- 플로팅 pill 컨테이너 구조를 사용한다.
- 전체 탭바는 밝은 크림톤 배경, 큰 radius, 부드러운 그림자를 가진 하나의 떠 있는 쉘로 설계한다.
- 탭바 폭은 디바이스 너비의 `80%`, 최대 `360`을 사용한다.
- 쉘 내부 좌우 패딩은 `18`, 내부 세로 패딩은 `7`을 사용한다.
- 기본 탭 구성은 `홈 / 식단 / 기록 / 식재료 / 더보기`다.
- 비활성 탭은 `outline` 아이콘만 노출한다.
- 활성 탭만 주황 pill 배경 안에 `fill 아이콘 + 라벨`을 함께 노출한다.
- 활성 pill 내부의 `아이콘 + 텍스트`는 하나의 그룹으로 묶어 중앙 정렬한다.
- 선택 상태가 바뀌면 활성 pill 배경은 `translateX + scaleX`로 이동하고, 탭 슬롯 폭도 함께 재분배되어 주변 아이콘 간격이 자연스럽게 바뀌어야 한다.
- 비활성 아이콘 색은 `tabIconDefault`, 활성 아이콘/텍스트 색은 `tabIconSelected`를 사용한다.
- `intro` 라우트에서는 탭바를 노출하지 않는다.

### 3.8 Onboarding Flow
- 라우팅 구조는 `index(gate) -> intro | home`로 구성한다.
- `index`는 프로필 유무를 확인해 `intro` 또는 `home`으로 리다이렉트한다.
- `intro`는 아기 프로필 입력 전용 화면이다.
- 입력 순서는 `이름/태명/별명 -> 생년월일 -> 프로필 사진(선택)`의 순차 노출을 사용한다.
- 각 단계는 이전 단계 검증 완료 후 노출하며, `fade + translateY` 애니메이션을 적용한다.
- 프로필 완료 전에는 홈 서비스 영역을 노출하지 않는다.

### 3.9 Meal Plan Visual Direction
- `meal-plan` 화면은 다른 화면보다 한 단계 더 강한 시각 대비를 허용한다.
- 단, 네온/원색 대신 파스텔 블록, 강조 배경, 장식 원형 레이어로 화려함을 만든다.
- 권장 톤 조합: Accent + Blush + Lavender + Cream
- 핵심 카드에는 상단 배지, 큰 숫자/요약, 장식 버블을 넣어도 된다.
- 화려함은 카드 내부에서만 사용하고, 화면 전체 배경은 기본 `background`를 유지한다.
- 전체 인상은 `육아 기록 앱`보다 `귀여운 성장 다이어리`에 가깝게 유지한다.

### 3.10 Journey Visual Direction
- `journey` 화면도 `meal-plan`과 동일한 수준의 파스텔 장식 카드를 사용할 수 있다.
- 달력, 선택 날짜 요약, 기록 카드에는 서로 다른 파스텔 면을 써서 정보 블록을 분리한다.
- 기록 반응 배지, 빈 상태 버튼은 accent 축을 유지하되 카드 배경은 Blush, Lavender, Cream 계열을 사용한다.
- 입력 화면과 상세 화면도 정보 도구처럼 차갑지 않게, 말랑한 radius와 포근한 색면을 유지한다.

### 3.11 Ingredient Visual Direction
- `ingredients` 화면은 그리드 카드 중심으로 파스텔 면 분할을 사용한다.
- 검색/필터/빈 상태/상세 시트에도 장식 버블과 부드러운 그림자를 넣어 화면 톤을 통일한다.
- 식재료 상태 배지는 정보 강조용으로만 쓰고, 카드 바탕색은 카테고리/상태와 별개로 부드러운 파스텔 계열을 유지한다.
- 식재료 검색 결과, 선택 칩, 플레이스홀더 이미지까지도 귀여운 다이어리 톤을 해치지 않도록 정리한다.

### 3.11.1 Photo + Copy Card Pattern
- 식재료 카드와 레시피 카드처럼 `상단 이미지(또는 결과물 프리뷰) + 하단 텍스트` 구조를 쓰는 2열 카드는 같은 규격을 사용한다.
- 카드 자체는 `radius 20`, `maxWidth 48.5%`, `overflow hidden`을 기본으로 한다.
- 상단 비주얼 영역은 정사각형 `aspectRatio 1`을 사용한다.
- 하단 본문은 `paddingHorizontal 12 / paddingVertical 12 / gap 7`을 기본으로 한다.
- 카드 제목은 `16 / 700`, 보조 설명은 `12 / lineHeight 18`을 기본으로 한다.
- 보조 pill은 카드 하단 본문 안에 두고, `paddingHorizontal 10 / paddingVertical 5 / fontSize 11` 규격을 사용한다.
- 레시피 카드도 식재료 카드와 같은 그리드 리듬을 유지하고, 달라지는 것은 상단 비주얼 내용과 배지 문구뿐이어야 한다.

### 3.12 Content and Ad Slots
- 정보/가이드 화면은 `hero -> 핵심 카드 -> FAQ -> 광고 슬롯` 순으로 읽히게 구성한다.
- 광고는 콘텐츠처럼 위장하지 않고 반드시 `광고` 배지로 먼저 구분한다.
- 광고 슬롯 바깥 카드 쉘은 서비스 디자인 시스템을 따르되, 실제 광고 영역은 Google Mobile Ads 배너를 안전하게 담는 컨테이너로 사용한다.
- 광고는 입력/편집 흐름이 강한 화면보다 더보기 기반 정보 화면이나 가이드 화면의 섹션 사이에 배치한다.
- 광고 영역도 radius, spacing, pastel tone은 서비스 규칙을 따르되, 내부 광고 자산은 플랫폼 정책을 우선한다.
- Expo Go에서는 광고 슬롯 플레이스홀더를 유지하고, dev build / standalone에서만 실제 Google 배너를 렌더링한다.

### 3.13 Lecture-Style Guide Layout
- `이유식 시작하기` 같은 학습형 화면은 메인 허브와 상세 화면을 분리해 `파트 선택 -> 파트 상세` 구조를 우선한다.
- 메인 허브에서는 체크리스트, 학습 현황, 파트 카드, FAQ 미리보기까지만 보여주고, 자세한 챕터 읽기는 파트 상세 화면으로 넘긴다.
- 중요한 전환점은 `파트`로 나누고, 각 파트는 전용 화면에서 챕터 카드들을 세로로 보여준다.
- 사용자는 파트 상세 화면에서 챕터를 읽음 처리하거나 책갈피로 저장할 수 있어야 하며, 그 상태는 메인 허브와 상세 화면 모두에서 다시 확인할 수 있어야 한다.
- 책갈피 영역은 상단 가까이에 두어 다시 볼 챕터로 빠르게 돌아갈 수 있게 한다.
- FAQ는 메인 허브에 5개까지만 미리 보여주고, 전체 목록은 별도 FAQ 화면에서 카테고리별로 볼 수 있어야 한다.
- FAQ 데이터는 화면 컴포넌트 안에 하드코딩하지 않고 별도 데이터 소스로 분리해 업데이트 비용을 낮춘다.
- 광고 슬롯은 허브 화면 하단이나 상세 읽기 흐름을 끊지 않는 지점에만 배치한다.

### 3.14 Toast
- 토스트는 화면 상단이 아니라 하단에 노출한다.
- 바텀 네비게이터가 있는 화면에서도 스크린 하단 기준이 먼저 느껴지도록, 하단 safe area 기준의 작은 오프셋만 둔다.
- 토스트 카드는 작은 시스템 알림처럼 차갑게 보이지 않도록 둥근 radius, 파스텔 배경, 말랑한 아이콘 배지를 사용한다.
- 토스트는 `level` 값을 기준으로 색상 테마, 아이콘, 보조 배지 톤을 함께 바꾼다.
- 기본 레벨은 `info`, 추가 레벨은 `success`, `warning`, `error`, `highlight`를 사용한다.
- 토스트는 제목 없이 메시지 한 줄만 노출하는 것을 기본으로 한다.
- 토스트 문구는 최대한 한 줄에서 끝나는 짧은 문장으로 작성한다.
- 액션이 있을 때도 우측에 작은 칩 형태로 붙이고, 본문보다 과하게 시선을 뺏지 않는다.

### 3.15 Foldable Card
- 접힘/펼침 가능한 안내 카드는 `FoldableCard` 공통 컴포넌트를 사용한다.
- 기본 상태는 화면 맥락에 따라 접힘 또는 펼침을 선택하되, 접힘 상태가 기본이면 헤더만 보여도 의미가 통하게 구성한다.
- 헤더는 `아이콘 + 제목 + 화살표` 구조를 사용하고, 화살표 방향으로 현재 상태를 바로 알 수 있어야 한다.
- 펼침/접힘 전환은 갑작스럽지 않게 `LayoutAnimation` 수준의 부드러운 높이 변화와 화살표 회전을 사용한다.

## 4. Motion Rules

- 화면 로드 시 최대 2단계 진입 애니메이션만 사용
- 권장: `fade + translateY(10~16)`
- 300~500ms 이내, 과도한 bounce 금지
- 기본 패턴: 첫 카드/헤더 블록이 먼저 들어오고, 나머지 섹션 카드가 뒤이어 들어오는 `2-step enter` 패턴을 사용한다.
- 구현은 가능하면 공통 훅/유틸을 통해 같은 속도와 거리로 맞춘다.
- 기본 구현은 `use-screen-enter-animation` 훅을 사용한다.
- 적용 순서: `상단 hero/header 카드 -> 나머지 본문 섹션`.
- 탭 화면, 편집 화면, 설정/문서 화면 모두 같은 진입 패턴을 사용한다.
- 인트로처럼 배경 float 또는 단계별 노출이 있는 화면도, 화면 최초 진입만큼은 같은 `2-step enter`를 먼저 따른다.
- 토스트는 `아래 -> 위` 진입, `위 -> 아래` 퇴장 모션을 사용한다.

## 5. Component Checklist (UI 작업 시)

새 화면/컴포넌트 작업 전 아래 체크를 통과해야 한다.

1. 배경이 `background` 토큰을 사용했는가?
2. 텍스트 폰트가 Pretendard로 통일됐는가?
3. 주요 액션은 accent 1축만 사용하는가?
4. 카드 radius/spacing이 토큰 범위를 벗어나지 않는가?
5. 제목-본문-메타 위계가 명확한가?
6. 하단 조작(FAB/탭) 접근성이 보장되는가?

## 6. Do / Don't

Do
- 라운드 카드 중심의 부드러운 시각언어 유지
- 한 화면에서 강조색은 1개 축으로 제한
- 정보를 카드 단위로 나눠 스캔 속도를 높임
- 기능 화면이라도 귀엽고 포근한 인상을 먼저 유지

Don't
- 강한 다색 대비를 동시에 사용
- 기본 시스템 폰트로 임의 회귀
- 네온/고채도 경고색을 메인 인터랙션에 사용
- 과한 그림자/글래스모피즘 추가
- 생산성 툴이나 관리자 화면처럼 건조한 인상으로 회귀

## 7. Implementation Mapping

- Token source: `constants/theme.ts`
- Gate screen: `app/(tabs)/index.tsx`
- Intro (profile onboarding): `app/(tabs)/intro.tsx`
- Home service screen: `app/(tabs)/home.tsx`
- Secondary example screen: `app/(tabs)/meal-plan.tsx`
- Reusable templates:
  - `components/design-system/section-header.tsx`
  - `components/design-system/quick-card.tsx`
  - `components/design-system/week-calendar.tsx`

## 8. Reusable Component Contracts

### SectionHeader
- 목적: 섹션 타이틀 + 우측 액션 텍스트(`See all`)를 일관된 위계로 렌더링
- 사용: 리스트 섹션 시작점에 배치
- 금지: 화면마다 임의 폰트 크기/정렬 재정의

### QuickCard
- 목적: Quick Journal의 파스텔 카드 템플릿
- 필수 입력: `title`, `body`, `toneColor`, `chipLabel`
- 규칙: 카드 폭/라운드/타이포는 컴포넌트 기본값을 우선 사용

### WeekCalendar
- 목적: 요일 라벨 + 날짜 버블 주간 선택 UI
- 필수 입력: `items`, `accentColor`, `dayColor`
- 규칙: 선택 상태는 `isActive`로만 제어하며 스타일 오버라이드는 최소화

### PageBackground
- 목적: 홈과 동일한 파스텔 오브 배경을 모든 주요 화면에 공통 적용
- 규칙: 루트 컨테이너 안에서 카드 뒤에만 렌더링하고, 콘텐츠와 상호작용하지 않도록 `pointerEvents="none"`을 유지한다.

### FloatingTabBar
- 목적: 서비스 전역의 커스텀 플로팅 탭바를 일관된 비율과 모션으로 렌더링
- 규칙: 새 탭 추가/삭제 시 `홈 / 식단 / 기록 / 식재료 / 더보기` 기본 비율이 깨지지 않도록 전체 폭과 활성 슬롯 비율을 함께 점검한다.
- 규칙: 활성 pill은 항상 이동 배경 레이어가 담당하고, 콘텐츠 레이어는 투명 상태를 유지한다.

### AdSlotCard
- 목적: 가이드/정보 화면의 광고 슬롯을 디자인 시스템 톤으로 감싸는 카드 쉘
- 규칙: 실제 광고 SDK 연결 전에도 `광고` 배지와 카드 여백 규칙을 유지한다.

### HeroHeaderCard
- 목적: 상세/편집/문서 화면 상단의 장식 히어로 카드를 공통 패턴으로 렌더링
- 필수 입력: `title`, `theme`, `backgroundColor`, `borderColor`, `backButtonColor`, `topBubbleColor`, `bottomBubbleColor`
- 선택 입력: `subtitle`, `eyebrow`, `onBack`
- 규칙: 뒤로가기가 필요한 화면은 이 컴포넌트를 우선 사용하고, 각 화면 파일 안에서 별도의 장식 버블/원형 back button 스타일을 다시 정의하지 않는다.

### use-screen-enter-animation
- 목적: 화면 최초 진입 시 `상단 블록 -> 본문 블록` 2단계 모션을 공통 속도로 제공
- 규칙: 새 화면은 별도 모션이 꼭 필요한 경우가 아니면 이 훅을 기본으로 사용한다.

디자인 변경 시 원칙:
1. 먼저 `docs/design-system.md` 갱신
2. 다음으로 `constants/theme.ts` 토큰 조정
3. 이후 `components/design-system/*` 템플릿 수정
4. 마지막으로 개별 화면 적용
