export const UserNodeID = {
  JuniorBruce: 'user-1',
  SeniorWayne: 'user-2',
  JuniorClark: 'user-3',
  SeniorKent: 'user-4',
} as const;

export const PolicyNodeID = {
  SlackServiceManagePolicy: 'policy-1',
} as const;

export const ResourceNodeID = {
  SlackIntegrationSecret: 'resource-1',
  SlackCrashlyticsNotifierService: 'resource-2',
} as const;

export const RoleNodeID = {
  SlackCodeDeployRole: 'role-1',
} as const;
