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
  s3_read_policy:
    // eslint-disable-next-line
    'H4sIAAAAAAAAEx3LsQqDMBAG4Hf5x5JQo0PhNofSsdBCF3GI4Swp0UjuxEF899Lu37fjxUVinkGoK1dbV1l3gcFTvfLEs4K6Hddx5KAgtCnlDQZt0H/qIA3dWO/D5wd6gwdLXktgEHyZyW9C0hDRsg4pBhsn/2Y5n3D0xxfL/5UxfQAAAA==',
  s3_read_write_policy:
    // eslint-disable-next-line
    'H4sIAAAAAAAAEzXLsQrCMBRG4Xf5R0mxaQfhbh3EUVFwKRnScAuV2EruDR1K310iOB74zoYnJ5mWGYSmtk1l68qeYPBQr/zmWUH9hvM4clAQuhiXFQZd0N/UQ1q6sF6HVwGm5C3/0xncWZacAhfq00x+FZKWiD55iFOovAirHA9wu9u/Oc8DlY4AAAA=',
  cloudfront_read_policy:
    // eslint-disable-next-line
    'H4sIAAAAAAAAE33MvQ6CMBRA4Xe5c4m0/OndENBdExfCgKUlTbBN2ksYCO9uZGJyPvnOCi/lg3EWEETMRcTjiBfA4Ek9qY+yBNiu0GitJAFCOU1uAQalpB21ICc3D9o7S3hXVJtA3rznvbI/sXJWmxE6Bg8V3Oyl+s16b7FfAh4ccpGkWV6cLzEXOBwWp4aX4ppUaZ01+a2Abuu2L2bnQJHQAAAA',
  dynamo_db_read_write_policy:
    // eslint-disable-next-line
    'H4sIAAAAAAAAE2XMOwuDMBSG4f9y5oSa9GKbzaGUbr3QLuIQ9QhCTCQ5QUT876UObaHrw/t9EzzRh9ZZUCATIblIuEiBwZ00YYeWQOUTHJsGKwIFmTFuAAZZRcsoh3q0unN1qU5IZ8IO2JeuEf34C5f41zz6WhMuWjC4YXDRV/h+1t4qPQT1SWPgqANxoYRcb7a7dH9IhFSkS4OrGNDz3rumNRigmIv5BWqbYS3cAAAA',
};

// Should have a string key and a func value which reads from a file
export const ENCODED_LEVEL_STAGES = {
  stage1: () => Promise.resolve(undefined),
  stage2: () => readFile(join(__dirname, 'snapshots', 'stage2.txt'), { encoding: 'utf-8' }),
  stage3: () => readFile(join(__dirname, 'snapshots', 'stage3.txt'), { encoding: 'utf-8' }),
};
