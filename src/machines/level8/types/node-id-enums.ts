import { uniqueId } from 'lodash';

export const UserNodeID = {
  TutorialFirstUser: uniqueId('user-'),
  InsideLevelUser1: uniqueId('user-'),
  InsideLevelUser2: uniqueId('user-'),
  InsideLevelUser3: uniqueId('user-'),
  InsideLevelUser4: uniqueId('user-'),
} as const;

export const PolicyNodeID = {
  TutorialS3ReadPolicy: uniqueId('policy-'),
  InLevelResourceBasedPolicy: uniqueId('policy-'),
  InLevelPermissionPolicy: uniqueId('policy-'),
} as const;

export const ResourcePolicyNodeID = {
  InLevelResourceBasedPolicy: uniqueId('policy-'),
} as const;

export const SCPNodeID = {
  TutorialSCP: uniqueId('scp-'),
  InLevelOUSCP: uniqueId('scp-'),
  InLevelAccountSCP: uniqueId('scp-'),
} as const;

export const ResourceNodeID = {
  TutorialSecret1: uniqueId('secret-'),
  TutorialSecret2: uniqueId('secret-'),
  TutorialSecret3: uniqueId('secret-'),
  InLevelSecret1: uniqueId('secret-'),
} as const;

export const AccountNodeID = {
  Dev: uniqueId('account-'),
  Staging: uniqueId('account-'),
  Prod: uniqueId('account-'),
} as const;

export const OUNodeID = {
  Dev: uniqueId('ou-'),
} as const;
