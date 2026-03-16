import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const constantsDir = path.join(workspaceRoot, 'constants');
const outputPath = path.join(constantsDir, 'generated-food-images.ts');

const recipeDir = path.join(workspaceRoot, 'assets', 'generated', 'recipes');
const ingredientDir = path.join(workspaceRoot, 'assets', 'generated', 'ingredients');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function buildRecord(dirPath) {
  if (!fs.existsSync(dirPath)) return [];

  return fs
    .readdirSync(dirPath)
    .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
    .sort()
    .map((fileName) => {
      const id = path.basename(fileName, path.extname(fileName));
      const relativePath = path.relative(constantsDir, path.join(dirPath, fileName)).replaceAll('\\', '/');
      return { id, relativePath };
    });
}

function linesForRecord(name, entries) {
  const lines = [`export const ${name}: Record<string, number> = {`];

  for (const entry of entries) {
    lines.push(`  ${JSON.stringify(entry.id)}: require(${JSON.stringify(relativePathLiteral(entry.relativePath))}),`);
  }

  lines.push('};');
  return lines;
}

function relativePathLiteral(relativePath) {
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

const recipeEntries = buildRecord(recipeDir);
const ingredientEntries = buildRecord(ingredientDir);

const fileContent = [
  '/**',
  ' * 생성된 음식 이미지 매핑 파일.',
  ' *',
  ' * 역할:',
  ' * - 로컬에서 생성된 이미지 파일을 앱 자산으로 연결한다.',
  ' * - image:sync 스크립트가 자동으로 다시 쓴다.',
  ' */',
  '',
  ...linesForRecord('GENERATED_RECIPE_IMAGES', recipeEntries),
  '',
  ...linesForRecord('GENERATED_INGREDIENT_IMAGES', ingredientEntries),
  '',
].join('\n');

fs.writeFileSync(outputPath, fileContent);

console.log(`synced recipe images: ${recipeEntries.length}`);
console.log(`synced ingredient images: ${ingredientEntries.length}`);
