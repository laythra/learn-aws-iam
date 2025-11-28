/** * \ud83d\udea8 EDUCATIONAL PROJECT - PLEASE DON'T SPOIL YOUR LEARNING! \ud83d\udea8
 *
 * This file contains test solutions for automated testing.
 * If you're here to learn AWS IAM policies, you're cheating yourself!
 *
 * The whole point is to understand WHY these policies work.
 * Copying them defeats the educational purpose.
 *
 * Please go through the tutorial step by step instead! \ud83c\udf93
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

type EncodedLoader = () => Promise<string>;

type StageLoader = () => Promise<string | undefined>;

export const ENCODED_TEST_SOLUTIONS: Record<
  'role1' | 'policy1' | 'policy2' | 'policy3',
  EncodedLoader
> = {
  role1: () => readFile(join(__dirname, 'policies', 'trust_policy1.txt'), { encoding: 'utf-8' }),
  policy1: () =>
    readFile(join(__dirname, 'policies', 'permission_policy1.txt'), { encoding: 'utf-8' }),
  policy2: () =>
    readFile(join(__dirname, 'policies', 'permission_policy2.txt'), { encoding: 'utf-8' }),
  policy3: () =>
    readFile(join(__dirname, 'policies', 'unnecessary_policy.txt'), { encoding: 'utf-8' }),
};

export const ENCODED_LEVEL_STAGES: Record<'stage1' | 'stage2', StageLoader> = {
  stage1: () => Promise.resolve(undefined),
  stage2: () => Promise.resolve(undefined),
};
