/**
 * \ud83d\udea8 EDUCATIONAL PROJECT - PLEASE DON'T SPOIL YOUR LEARNING! \ud83d\udea8
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

export const ENCODED_TEST_SOLUTIONS: Record<'role1' | 'role2' | 'role3', EncodedLoader> = {
  role1: () => readFile(join(__dirname, 'roles', 'role1.txt'), { encoding: 'utf-8' }),
  role2: () => readFile(join(__dirname, 'roles', 'role2.txt'), { encoding: 'utf-8' }),
  role3: () => readFile(join(__dirname, 'roles', 'role3.txt'), { encoding: 'utf-8' }),
};

export const ENCODED_LEVEL_STAGES: Record<'stage1' | 'stage2', StageLoader> = {
  stage1: () => Promise.resolve(undefined),
  stage2: () => readFile(join(__dirname, 'snapshots', 'stage2.txt'), { encoding: 'utf-8' }),
};
