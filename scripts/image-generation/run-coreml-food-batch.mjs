import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const workspaceRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const defaultJobsPath = path.join(workspaceRoot, 'scripts', 'image-generation', 'food-image-jobs.json');

function readArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

const jobsPath = path.resolve(readArg('--jobs', defaultJobsPath));
const rawTypeFilter = readArg('--type', 'all');
const typeFilter =
  rawTypeFilter === 'recipes'
    ? 'recipe'
    : rawTypeFilter === 'ingredients'
      ? 'ingredient'
      : rawTypeFilter;
const idFilter = readArg('--id', '');
const limit = Number(readArg('--limit', '0'));
const overwrite = hasFlag('--overwrite');

const engineDir = process.env.ML_STABLE_DIFFUSION_DIR;
const rawModelDir = process.env.ML_STABLE_DIFFUSION_MODEL_DIR;
const isXL = process.env.ML_STABLE_DIFFUSION_IS_XL !== '0';
const runtimeHome = path.join(workspaceRoot, '.image-generation-home');
const runtimeCacheRoot = path.join(workspaceRoot, '.image-generation-cache');
const clangCacheDir = path.join(runtimeCacheRoot, 'clang');
const xdgCacheDir = path.join(runtimeCacheRoot, 'xdg');
const swiftBuildDir = path.join(runtimeCacheRoot, 'swift-build');

if (!engineDir || !rawModelDir) {
  console.error('Missing environment variables: ML_STABLE_DIFFUSION_DIR and ML_STABLE_DIFFUSION_MODEL_DIR');
  process.exit(1);
}

for (const dirPath of [runtimeHome, runtimeCacheRoot, clangCacheDir, xdgCacheDir, swiftBuildDir]) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function hasStableDiffusionResources(dirPath) {
  return (
    fs.existsSync(path.join(dirPath, 'merges.txt')) &&
    fs.existsSync(path.join(dirPath, 'vocab.json'))
  );
}

function resolveResourcePath(startDir) {
  if (hasStableDiffusionResources(startDir)) {
    return startDir;
  }

  const queue = [startDir];

  while (queue.length > 0) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const nextDir = path.join(current, entry.name);

      if (hasStableDiffusionResources(nextDir)) {
        return nextDir;
      }

      queue.push(nextDir);
    }
  }

  return startDir;
}

const modelDir = resolveResourcePath(rawModelDir);

if (!fs.existsSync(jobsPath)) {
  console.error(`Jobs file not found: ${jobsPath}`);
  process.exit(1);
}

const jobsFile = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
const jobs = jobsFile.jobs.filter(
  (job) =>
    (typeFilter === 'all' || job.type === typeFilter) &&
    (!idFilter || job.id === idFilter)
);
const limitedJobs = limit > 0 ? jobs.slice(0, limit) : jobs;

for (const job of limitedJobs) {
  const outputPath = path.join(workspaceRoot, job.outputRelativePath);
  const tempOutputDir = path.join(runtimeCacheRoot, 'generated-output', job.id);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(tempOutputDir, { recursive: true });

  if (!overwrite && fs.existsSync(outputPath)) {
    console.log(`skip existing: ${job.outputRelativePath}`);
    continue;
  }

  console.log(`generate ${job.type}: ${job.name}`);

  const args = [
    'run',
    'StableDiffusionSample',
    job.prompt,
    '--negative-prompt',
    job.negativePrompt,
    '--resource-path',
    modelDir,
    '--image-count',
    '1',
    '--seed',
    String(job.seed),
    '--output-path',
    tempOutputDir,
    '--compute-units',
    'cpuAndGPU',
    '--step-count',
    String(job.steps),
    '--guidance-scale',
    String(job.guidanceScale),
  ];

  if (isXL) {
    args.push('--xl');
  }

  const result = spawnSync('swift', args, {
    cwd: engineDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      HOME: runtimeHome,
      XDG_CACHE_HOME: xdgCacheDir,
      CLANG_MODULE_CACHE_PATH: clangCacheDir,
      SWIFTPM_BUILD_DIR: swiftBuildDir,
    },
  });

  if (result.status !== 0) {
    console.error(`generation failed: ${job.id}`);
    process.exit(result.status ?? 1);
  }

  const generatedFiles = fs
    .readdirSync(tempOutputDir)
    .filter((fileName) => /\.(png|jpg|jpeg)$/i.test(fileName))
    .sort((a, b) => {
      const aTime = fs.statSync(path.join(tempOutputDir, a)).mtimeMs;
      const bTime = fs.statSync(path.join(tempOutputDir, b)).mtimeMs;
      return bTime - aTime;
    });

  if (generatedFiles.length === 0) {
    console.error(`no generated image found for ${job.id}`);
    process.exit(1);
  }

  fs.renameSync(path.join(tempOutputDir, generatedFiles[0]), outputPath);
  console.log(`saved: ${job.outputRelativePath}`);
}

console.log(`generated jobs: ${limitedJobs.length}`);
