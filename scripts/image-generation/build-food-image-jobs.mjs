import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const workspaceRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const sourcePath = path.join(workspaceRoot, 'scripts', 'image-generation', 'food-image-subjects.json');
const outputPath = path.join(workspaceRoot, 'scripts', 'image-generation', 'food-image-jobs.json');

function createDeterministicSeed(input) {
  let hash = 0;
  for (const char of input) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return (hash % 900000000) + 100000000;
}

function buildPrompt(basePrompt, subjectPrompt, extraPrompt) {
  return [basePrompt, subjectPrompt, extraPrompt].filter(Boolean).join(', ');
}

function englishStage(stage) {
  switch (stage) {
    case '초기':
      return 'initial stage';
    case '중기':
      return 'middle stage';
    case '후기':
      return 'late stage';
    default:
      return stage;
  }
}

function ingredientPresentationPrompt(category) {
  switch (category) {
    case '곡물':
    case '유제품':
      return 'small white ceramic bowl, centered, soft studio shadow';
    case '단백질':
    case '기타':
      return 'small white ceramic plate, centered, soft studio shadow';
    case '채소':
    case '과일':
    default:
      return 'single gathered ingredient group, centered studio product photo, three-quarter angle, soft natural shadow, not flat lay';
  }
}

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const recipeJobs = source.recipes.map((item) => ({
  id: item.id,
  type: 'recipe',
  name: item.name,
  stage: item.stage,
  seed: createDeterministicSeed(`recipe:${item.id}`),
  steps: source.stylePreset.steps,
  guidanceScale: source.stylePreset.guidanceScale,
  size: source.stylePreset.size,
  prompt: buildPrompt(
    source.stylePreset.recipeBase ?? source.stylePreset.positiveBase,
    item.subjectPrompt,
    `${englishStage(item.stage)} baby food, plated dish`
  ),
  negativePrompt: source.stylePreset.negativeBase,
  outputRelativePath: `assets/generated/recipes/${item.id}.png`,
}));

const ingredientJobs = source.ingredients.map((item) => ({
  id: item.id,
  type: 'ingredient',
  name: item.name,
  category: item.category,
  seed: createDeterministicSeed(`ingredient:${item.id}`),
  steps: source.stylePreset.steps,
  guidanceScale: source.stylePreset.guidanceScale,
  size: source.stylePreset.size,
  prompt: buildPrompt(
    source.stylePreset.ingredientBase ?? source.stylePreset.positiveBase,
    item.subjectPrompt,
    ingredientPresentationPrompt(item.category)
  ),
  negativePrompt: source.stylePreset.negativeBase,
  outputRelativePath: `assets/generated/ingredients/${item.id}.png`,
}));

const jobs = [...recipeJobs, ...ingredientJobs];

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      counts: {
        recipes: recipeJobs.length,
        ingredients: ingredientJobs.length,
        total: jobs.length,
      },
      jobs,
    },
    null,
    2
  )
);

console.log(`food image jobs written: ${outputPath}`);
console.log(`recipes=${recipeJobs.length} ingredients=${ingredientJobs.length} total=${jobs.length}`);
