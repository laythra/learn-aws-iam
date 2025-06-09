import { uniqueId } from 'lodash';

export const UserNodeID = {
  TutorialFirstUser: uniqueId('user-'),
  JuniorBruce: uniqueId('user-'),
  SeniorWayne: uniqueId('user-'),
  JuniorClark: uniqueId('user-'),
  SeniorKent: uniqueId('user-'),
  JuniorDiana: uniqueId('user-'),
} as const;

export const PolicyNodeID = {
  SlackServiceManagePolicy: 'policy-1',
} as const;

export const ResourcePolicyNodeID = {
  InLevelResourceBasedPolicy: uniqueId('policy-'),
} as const;

export const ResourceNodeID = {
  SlackIntegrationSecret: 'resource-1',
  SlackCrashlyticsNotifierService: 'resource-2',
} as const;

export const RoleNodeID = {
  SlackCodeDeployRole: 'role-1',
};
