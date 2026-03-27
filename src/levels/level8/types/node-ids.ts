export const UserNodeID = {
  JuniorAlex: 'user-1',
  SeniorSam: 'user-2',
  JuniorMorgan: 'user-3',
  SeniorJordan: 'user-4',
} as const;

export const PolicyNodeID = {
  SlackCodeDeployPolicy: 'policy-1',
  SlackSecretsAccessPolicy: 'policy-2',
} as const;

export const ResourceNodeID = {
  SlackIntegrationSecret: 'resource-1',
  SlackCrashlyticsNotifierService: 'resource-2',
} as const;
