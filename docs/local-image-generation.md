# 로컬 이미지 생성 가이드

목적: 식재료/레시피 실사 이미지를 비용 없이 로컬에서 생성하고, 앱 자산으로 바로 연결하는 흐름을 정리한다.

## 1. 권장 조합

Apple Silicon M3 Pro 36GB 기준 권장 조합은 아래다.

- 엔진: `apple/ml-stable-diffusion`
- 모델: `apple/coreml-stable-diffusion-mixed-bit-palettization`
- 생성 크기: `512x512`
- 기본 스텝: `28`
- 생성 대상: 레시피 이미지 먼저, 식재료 이미지는 후속 배치 생성

이 조합을 쓰는 이유:

- Apple Silicon 최적화 경로라 로컬 무료 생성에 유리하다.
- Core ML 기반이라 macOS/Xcode 환경과 궁합이 좋다.
- 음식 사진처럼 반복 생성이 많은 작업에 배치 스크립트를 붙이기 쉽다.

참고:

- Apple 엔진: <https://github.com/apple/ml-stable-diffusion>
- Apple Core ML Stable Diffusion 모델: <https://huggingface.co/apple/coreml-stable-diffusion-mixed-bit-palettization>

## 2. 프로젝트에 이미 들어간 구성

- 프롬프트 원본 데이터: `scripts/image-generation/food-image-subjects.json`
- 작업 큐 생성: `npm run image:jobs`
- Core ML 배치 생성: `npm run image:coreml`
- 에셋 매핑 동기화: `npm run image:sync`
- 자동 매핑 파일: `constants/generated-food-images.ts`

앱 연결 대상:

- 레시피: `components/design-system/recipe-preview.tsx`
- 식재료: `app/(tabs)/ingredients.tsx`, `app/record-editor.tsx`

## 3. 최초 설치

```bash
bash ./scripts/image-generation/setup-apple-local-image-stack.sh
```

설치 후 환경 변수:

```bash
export ML_STABLE_DIFFUSION_DIR="/Users/sy/VSCodeProjects/weaning-diary/tools/ml-stable-diffusion"
export ML_STABLE_DIFFUSION_MODEL_DIR="/Users/sy/VSCodeProjects/weaning-diary/tools/models/coreml-stable-diffusion-mixed-bit-palettization"
export ML_STABLE_DIFFUSION_IS_XL=1
```

## 4. 생성 순서

### 4-1. 작업 큐 생성

```bash
npm run image:jobs
```

생성 파일:

- `scripts/image-generation/food-image-jobs.json`

### 4-2. 레시피 먼저 생성

```bash
npm run image:coreml -- --type recipes
```

빠르게 샘플만 보고 싶을 때:

```bash
npm run image:coreml -- --type recipes --limit 2
```

### 4-3. 식재료 생성

```bash
npm run image:coreml -- --type ingredients
```

기존 파일까지 다시 덮어쓰려면:

```bash
npm run image:coreml -- --type ingredients --overwrite
```

### 4-4. 앱 자산 매핑 갱신

```bash
npm run image:sync
```

이 단계가 끝나면 `constants/generated-food-images.ts`가 실제 이미지 파일을 참조하도록 갱신된다.

## 5. 결과물 위치

- 레시피: `assets/generated/recipes/*.png`
- 식재료: `assets/generated/ingredients/*.png`

권장 규칙:

- 파일명은 `id`와 같게 유지한다.
- 레시피는 `recipeId`, 식재료는 `ingredientId`를 그대로 쓴다.
- 최종 채택본만 커밋한다.

## 6. 프롬프트 수정 원칙

프롬프트는 `food-image-subjects.json`에서 관리한다.

- `positiveBase`: 전체 스타일을 고정한다.
- `recipeBase`, `ingredientBase`: 레시피와 식재료 기본 구도를 분리한다.
- `negativeBase`: 손, 텍스트, 로고, 그림체를 차단한다.
- `subjectPrompt`: 음식별 차이를 만든다.
- 식재료 이미지는 `정사각형 + 순백 배경 + 단일 원물 상품 사진`을 기본 규칙으로 유지한다.
- 채소와 과일은 플랫레이 패턴보다 `한 묶음 / 한 덩어리 / 한 개체`가 또렷한 스튜디오 썸네일을 우선한다.
- 식재료는 반드시 `작은 접시나 그릇` 위에 올려진 썸네일 이미지로 유도한다.
- 레시피 이미지는 완성 접시 중심, 식재료 이미지는 재료 단품 중심으로 분리한다.

좋은 수정 예시:

- `small ceramic baby bowl`
- `single serving`
- `top-down shot`
- `soft natural daylight`
- `realistic texture`
- `pure white background`
- `centered composition`
- `mobile app thumbnail`
- `small white ceramic plate or bowl`

지양 예시:

- 배경 소품 과다
- 사람 손 등장
- 글자, 라벨, 포장지 등장
- 여러 접시가 같이 보이는 구도
- 회색/베이지 배경 위 단일 식재료 사진

## 7. 운영 팁

- 처음에는 레시피 6개만 먼저 생성해 품질을 본다.
- 마음에 들지 않는 항목만 `subjectPrompt`를 고쳐 재생성한다.
- 식재료는 카드 시각 일관성이 중요하므로 구도를 최대한 통일한다.
- 배치 생성 후 `npm run image:sync`를 빼먹지 않는다.

## 8. 한계

- 모델 다운로드 용량이 크다.
- Core ML 경로는 앱 런타임 생성이 아니라 개발 시점 일괄 생성에 적합하다.
- 최종 품질 검수는 사람이 직접 해야 한다.
