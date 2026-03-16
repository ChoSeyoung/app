## 수동 이미지 생성 프롬프트 킷

이 문서는 ChatGPT 이미지 생성에서 식재료 썸네일을 수동으로 만들 때 바로 복붙할 수 있도록 정리한 프롬프트 모음이다.

목표는 아래 4가지다.

- 사람이 바로 떠올리는 대표 원물 이미지
- 카드용 정사각형 구도
- 순백 배경
- 불필요한 소품 없이 단일 주제만 보이기

### 1. 공통 규칙

식재료 이미지는 아래 원칙을 항상 유지한다.

- `1:1 square composition`
- `pure white seamless background`
- `photorealistic studio product photo`
- `centered subject`
- `soft natural studio lighting`
- `clean soft shadow`
- `no text, no label, no hands, no person`

### 2. 공통 프롬프트 템플릿

아래 템플릿에서 `{{subject}}`, `{{rule}}`만 바꿔서 사용한다.

```text
Photorealistic studio product photo of {{subject}}, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, {{rule}}. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no garnish, no table setting, no colored background.
```

### 3. visualType별 규칙

#### `leafyGreen`

```text
exactly one tied bunch only, stems together, leaves attached, no loose leaves, no scattered leaves
```

예시

```text
Photorealistic studio product photo of one fresh spinach bunch, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one tied bunch only, stems together, leaves attached, no loose leaves, no scattered leaves. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no garnish, no table setting, no colored background.
```

#### `grainLoose`

```text
exactly one small white ceramic bowl only, one serving, no second bowl, no extra grains outside the bowl
```

예시

```text
Photorealistic studio product photo of uncooked white rice grains, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one small white ceramic bowl only, one serving, no second bowl, no extra grains outside the bowl. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no garnish, no table setting, no colored background.
```

#### `rootVegetable`

```text
exactly one ingredient group only, whole produce, no slices, no cut pieces, no extra produce
```

예시

```text
Photorealistic studio product photo of whole carrots, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one ingredient group only, whole produce, no slices, no cut pieces, no extra produce. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no garnish, no table setting, no colored background.
```

#### `squash`

```text
exactly one pumpkin wedge only, clean cut surface visible, no second piece
```

예시

```text
Photorealistic studio product photo of one fresh pumpkin wedge with vivid orange flesh, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one pumpkin wedge only, clean cut surface visible, no second piece. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no garnish, no table setting, no colored background.
```

#### `cruciferous`

```text
exactly one whole vegetable head only, no florets, no chopped pieces, no second vegetable
```

예시

```text
Photorealistic studio product photo of one fresh broccoli head, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one whole vegetable head only, no florets, no chopped pieces, no second vegetable. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no garnish, no table setting, no colored background.
```

#### `allium`

```text
exactly one whole onion only, peeled, no slices, no second onion
```

예시

```text
Photorealistic studio product photo of one whole peeled onion, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one whole onion only, peeled, no slices, no second onion. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no garnish, no table setting, no colored background.
```

#### `fruitSingle`

```text
exactly one whole fruit only, no slices, no cut fruit, no second fruit
```

예시

```text
Photorealistic studio product photo of one whole red apple, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one whole fruit only, no slices, no cut fruit, no second fruit. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no garnish, no table setting, no colored background.
```

#### `fruitCurved`

```text
exactly one whole fruit only, curved side profile, no slices, no second fruit
```

예시

```text
Photorealistic studio product photo of one whole banana, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one whole fruit only, curved side profile, no slices, no second fruit. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no garnish, no table setting, no colored background.
```

#### `proteinFillet`

```text
exactly one small white ceramic plate only, one fillet only, no garnish, no herb, no sauce
```

예시

```text
Photorealistic studio product photo of plain chicken breast fillet, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one small white ceramic plate only, one fillet only, no garnish, no herb, no sauce. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no table setting, no colored background.
```

#### `proteinBlock`

```text
exactly one small white ceramic plate only, one tofu block only, no garnish, no sauce
```

예시

```text
Photorealistic studio product photo of one block of soft tofu, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one small white ceramic plate only, one tofu block only, no garnish, no sauce. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no table setting, no colored background.
```

#### `proteinPieces`

```text
exactly one small white ceramic plate only, one serving only, no second serving, no garnish, no sauce
```

예시

```text
Photorealistic studio product photo of cooked egg yolk halves, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one small white ceramic plate only, one serving only, no second serving, no garnish, no sauce. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no table setting, no colored background.
```

#### `dairyBowl`

```text
exactly one small white ceramic bowl only, one serving only, no topping, no fruit, no spoon
```

예시

```text
Photorealistic studio product photo of plain yogurt, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one small white ceramic bowl only, one serving only, no topping, no fruit, no spoon. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no table setting, no colored background.
```

#### `dairyPlate`

```text
exactly one small white ceramic plate only, one serving only, no garnish, no second plate
```

예시

```text
Photorealistic studio product photo of mild cheese cubes, centered in a 1:1 square composition, pure white seamless background, soft natural studio lighting, clean soft shadow, simple baby-food app thumbnail, exactly one small white ceramic plate only, one serving only, no garnish, no second plate. No text, no logo, no label, no hands, no person, no extra ingredients, no duplicate items, no table setting, no colored background.
```

### 4. ChatGPT에서 바로 쓰는 운영 팁

- 먼저 한 장 생성한 뒤, 마음에 안 들면 아래처럼 짧게 수정 요청한다.

```text
좋아. 그런데 fruit가 여러 개 나왔어. 정확히 한 개만 나오게 다시 만들어줘.
```

```text
좋아. 그런데 접시가 두 개야. 작은 흰 접시 하나만 남기고 다시 만들어줘.
```

```text
좋아. 그런데 배경이 회색이야. 완전 순백 배경으로 다시 만들어줘.
```

```text
좋아. 그런데 시금치가 흩어진 잎이야. 줄기가 붙어 있는 한 단으로 다시 만들어줘.
```

### 5. 우선 검수 대상

가장 먼저 아래 6개부터 고정하는 게 좋다.

- 쌀
- 시금치
- 당근
- 사과
- 닭고기
- 요거트

이 6개가 안정되면 나머지는 같은 규칙으로 확장하기 쉽다.
