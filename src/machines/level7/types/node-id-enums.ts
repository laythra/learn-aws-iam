import { uniqueId } from 'lodash';

export const UserNodeID = {
  TutorialFirstUser: uniqueId('user-'),
  InsideLevelUser: uniqueId('user-'),
} as const;

export const PolicyNodeID = {
  TutorialResourceBasedPolicy: uniqueId('policy-'),
  InsideLevelResourceBasedPolicy: uniqueId('policy-'),
  InsideLevelIdentityBasedPolicy: uniqueId('policy-'),
} as const;

export const ResourceNodeID = {
  TutorialS3Bucket: uniqueId('policy-'),
  InsideLevelS3Bucket: uniqueId('policy-'),
} as const;
