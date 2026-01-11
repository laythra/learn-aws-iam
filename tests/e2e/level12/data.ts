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
  ec2RegionSCP: () => readFile(join(__dirname, 'policies', 'policy2.txt'), { encoding: 'utf-8' }),
  ec2TrustPolicy: () => readFile(join(__dirname, 'policies', 'policy3.txt'), { encoding: 'utf-8' }),
  s3WritePolicy: () => readFile(join(__dirname, 'policies', 'policy4.txt'), { encoding: 'utf-8' }),
  elasticacheManagePolicy: () =>
    readFile(join(__dirname, 'policies', 'policy5.txt'), { encoding: 'utf-8' }),
  permissionBoundary1: () =>
    readFile(join(__dirname, 'policies', 'policy6.txt'), { encoding: 'utf-8' }),
  accessDelegationPolicy: () =>
    readFile(join(__dirname, 'policies', 'policy7.txt'), { encoding: 'utf-8' }),
};

export const ENCODED_LEVEL_STAGES = {
  stage1: () => Promise.resolve(undefined),
  stage2: () => readFile(join(__dirname, 'snapshots', 'stage2.txt'), { encoding: 'utf-8' }),
};
