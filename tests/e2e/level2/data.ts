import { readFile } from 'fs/promises';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ENCODED_LEVEL_STAGES = {
  stage1: () => Promise.resolve(undefined),
  stage2: () => readFile(join(__dirname, 'snapshots', 'stage2.txt'), { encoding: 'utf-8' }),
  stage3: () => readFile(join(__dirname, 'snapshots', 'stage3.txt'), { encoding: 'utf-8' }),
};
