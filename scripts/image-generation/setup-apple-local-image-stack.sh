#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
TOOLS_DIR="${ROOT_DIR}/tools"
ENGINE_DIR="${TOOLS_DIR}/ml-stable-diffusion"
MODEL_DIR="${TOOLS_DIR}/models/coreml-stable-diffusion-mixed-bit-palettization"
MODEL_REPO="${MODEL_REPO:-apple/coreml-stable-diffusion-mixed-bit-palettization}"

mkdir -p "${TOOLS_DIR}/models"

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew가 필요합니다."
  exit 1
fi

if ! command -v swift >/dev/null 2>&1; then
  echo "Swift가 필요합니다."
  exit 1
fi

if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "Xcode command line tools가 필요합니다."
  exit 1
fi

if ! command -v git-lfs >/dev/null 2>&1; then
  echo "git-lfs 설치 중..."
  brew install git-lfs
fi

git lfs install

if [ ! -d "${ENGINE_DIR}/.git" ]; then
  echo "Apple ml-stable-diffusion 엔진 클론 중..."
  git clone https://github.com/apple/ml-stable-diffusion.git "${ENGINE_DIR}"
fi

if [ ! -d "${MODEL_DIR}/.git" ]; then
  echo "Core ML 모델 클론 중..."
  git clone "https://huggingface.co/${MODEL_REPO}" "${MODEL_DIR}"
fi

cat <<EOF

설치 완료.

다음 환경 변수를 등록하세요.

export ML_STABLE_DIFFUSION_DIR="${ENGINE_DIR}"
export ML_STABLE_DIFFUSION_MODEL_DIR="${MODEL_DIR}"
export ML_STABLE_DIFFUSION_IS_XL=1

그 다음 순서:
1. npm run image:jobs
2. npm run image:coreml -- --type recipes
3. npm run image:coreml -- --type ingredients
4. npm run image:sync

EOF
