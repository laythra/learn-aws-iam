import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ENCODED_TEST_SOLUTIONS = {
  policy1: () => readFile(join(__dirname, 'policies', 'policy1.txt'), { encoding: 'utf-8' }),
  policy2: () => readFile(join(__dirname, 'policies', 'policy2.txt'), { encoding: 'utf-8' }),
};

export const ENCODED_LEVEL_STAGES = {
  stage1: () => Promise.resolve(undefined),
  stage2: () => readFile(join(__dirname, 'snapshots', 'stage2.txt'), { encoding: 'utf-8' }),
  stage3: () => readFile(join(__dirname, 'snapshots', 'stage3.txt'), { encoding: 'utf-8' }),
  stage4: () => readFile(join(__dirname, 'snapshots', 'stage4.txt'), { encoding: 'utf-8' }),
  stage5: () => readFile(join(__dirname, 'snapshots', 'stage5.txt'), { encoding: 'utf-8' }),
};
