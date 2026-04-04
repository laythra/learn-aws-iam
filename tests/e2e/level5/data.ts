import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

type EncodedLoader = () => Promise<string>;

type StageLoader = () => Promise<string | undefined>;

export const ENCODED_TEST_SOLUTIONS: Record<
  'role1' | 'role2' | 'role3' | 'assumeRolePolicy',
  EncodedLoader
> = {
  role1: () => readFile(join(__dirname, 'roles', 'role1.txt'), { encoding: 'utf-8' }),
  role2: () => readFile(join(__dirname, 'roles', 'role2.txt'), { encoding: 'utf-8' }),
  role3: () => readFile(join(__dirname, 'roles', 'role3.txt'), { encoding: 'utf-8' }),
  assumeRolePolicy: () =>
    readFile(join(__dirname, 'policies', 'assume-role-policy.txt'), { encoding: 'utf-8' }),
};

export const ENCODED_LEVEL_STAGES: Record<'stage1' | 'stage2', StageLoader> = {
  stage1: () => Promise.resolve(undefined),
  stage2: () => readFile(join(__dirname, 'snapshots', 'stage2.txt'), { encoding: 'utf-8' }),
};
