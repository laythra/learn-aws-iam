import { uniqueId } from 'lodash';

export const UserNodeID = {
  TutorialFirstUser: uniqueId('user-'),
  InsideLevelUser: uniqueId('user-'),
} as const;

export const PolicyNodeID = {
  TutorialS3ReadPolicy: uniqueId('policy-'),
} as const;

export const SCPNodeID = {
  TutorialSCP: uniqueId('scp-'),
} as const;

export const ResourceNodeID = {
  TutorialSecret1: uniqueId('secret-'),
  TutorialSecret2: uniqueId('secret-'),
  TutorialSecret3: uniqueId('secret-'),
} as const;

export const AccountNodeID = {
  Dev: uniqueId('account-'),
} as const;

export const OUNodeID = {
  Dev: uniqueId('ou-'),
} as const;
