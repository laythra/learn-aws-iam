/**
 * 🚨 EDUCATIONAL PROJECT - PLEASE DON'T SPOIL YOUR LEARNING! 🚨
 *
 * This file contains test solutions for automated testing.
 * If you're here to learn AWS IAM policies, you're cheating yourself!
 *
 * The whole point is to understand WHY these policies work.
 * Copying them defeats the educational purpose.
 *
 * Please go through the tutorial step by step instead! 🎓
 */

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
};
