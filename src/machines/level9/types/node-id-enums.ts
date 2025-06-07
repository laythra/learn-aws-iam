import { uniqueId } from 'lodash';

export const UserNodeID = {
  James: uniqueId('user-'),
  Bond: uniqueId('user-'),
  JuniorBruce: uniqueId('user-'),
  SeniorWayne: uniqueId('user-'),
  JuniorClark: uniqueId('user-'),
  SeniorKent: uniqueId('user-'),
  JuniorDiana: uniqueId('user-'),
} as const;

export const PolicyNodeID = {
  InLevelPermissionPolicy: uniqueId('policy-'),
  TutorialEC2TerminatePolicy: uniqueId('policy-'),
} as const;

export const ResourcePolicyNodeID = {
  InLevelResourceBasedPolicy: uniqueId('policy-'),
} as const;

export const SCPNodeID = {
  InLevelOUSCP: uniqueId('scp-'),
  InLevelAccountSCP: uniqueId('scp-'),
} as const;

export const ResourceNodeID = {
  TutorialEC2Instance1: uniqueId('resource-'),
  TutorialEC2Instance2: uniqueId('resource-'),
  TutorialEC2Instance3: uniqueId('resource-'),
  TutorialEC2Instance4: uniqueId('resource-'),
  InLevelSecret1: uniqueId('secret-'),
  InLevelSecret2: uniqueId('secret-'),
  InLevelSecret3: uniqueId('secret-'),
} as const;

export const AccountNodeID = {
  Dev: uniqueId('account-'),
  Staging: uniqueId('account-'),
  Prod: uniqueId('account-'),
} as const;

export const OUNodeID = {
  Dev: uniqueId('ou-'),
} as const;
