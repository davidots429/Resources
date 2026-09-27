import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceDirectory = join(projectRoot, 'files', 'foodtech');
const targetDirectory = join(projectRoot, 'public', 'foodtech', 'files');

await rm(targetDirectory, { recursive: true, force: true });
await mkdir(dirname(targetDirectory), { recursive: true });
await cp(sourceDirectory, targetDirectory, {
  recursive: true,
  filter: (source) => !source.endsWith('README.md'),
});

console.log(`자료실 정적 파일 동기화 완료: ${targetDirectory}`);
