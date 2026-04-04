export const UserNodeID = {
  Alex: 'alex',
  Sam: 'sam',
  Morgan: 'morgan',
  Jordan: 'jordan',
} as const;

export const PermissionBoundaryID = {
  PermissionBoundary1: 'PB1',
  SecretsReadingPermissionBoundary: 'PB2',
} as const;

export const ResourceNodeID = {
  S3BucketTutorial: 's3bucket-1',
  S3BucketInLevel: 's3bucket-2',
  LambdaFunction: 'resource-lambda-1',
  ElasticCache: 'resource-elasticache-1',
  Secret1: 'resource-secret-1',
  Secret2: 'resource-secret-2',
} as const;

export const PolicyNodeID = {
  Policy1: 'policy-1',
  FullAccessPolicy: 'policy-2',
  AccessDelegationPolicy: 'policy-3',
  AssumeRolePolicy: 'policy-4',
} as const;

export const RoleNodeID = {
  Role1: 'role-1',
} as const;
