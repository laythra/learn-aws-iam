import { uniqueId } from 'lodash';

export const UserNodeID = {
  TutorialFirstUser: uniqueId('user-'),
  InsideLevelUser: uniqueId('user-'),
} as const;

export const ResourcePolicyNodeID = {
  TutorialResourceBasedPolicy: uniqueId('policy-'),
  InsideLevelResourceBasedPolicy: uniqueId('policy-'),
} as const;

export const PolicyNodeID = {
  InsideLevelIdentityBasedPolicy: uniqueId('policy-'),
};

export const ResourceNodeID = {
  TutorialS3Bucket: uniqueId('resource-'),
  InsideLevelS3Bucket: uniqueId('resource-'),
} as const;
