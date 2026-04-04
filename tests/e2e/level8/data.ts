import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

type EncodedLoader = () => Promise<string>;
type StageLoader = () => Promise<string | undefined>;

export const ENCODED_TEST_SOLUTIONS: Record<'policy1' | 'policy2', EncodedLoader> = {
  policy1: () => readFile(join(__dirname, 'policies', 'policy1.txt'), { encoding: 'utf-8' }),
  policy2: () => readFile(join(__dirname, 'policies', 'policy2.txt'), { encoding: 'utf-8' }),
};

export const ENCODED_LEVEL_STAGES: Record<'stage1' | 'stage2', StageLoader> = {
  stage1: () => Promise.resolve(undefined),
  stage2: () => readFile(join(__dirname, 'snapshots', 'stage2.txt'), { encoding: 'utf-8' }),
};
