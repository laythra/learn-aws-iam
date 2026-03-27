export const UserNodeID = {
  FinanceUser: 'user-1',
} as const;

export const ResourceNodeID = {
  BillingAndCostManagement: 'resource-1',
  FinanceS3Bucket: 'resource-2',
  LambdaFunction: 'resource-3',
  ChatImagesS3Bucket: 'resource-4',
  EC2Instance: 'resource-5',
} as const;

export const RoleNodeID = {
  FinanceAuditorRole: 'role-1',
  S3ReadAccessRole: 'role-2',
  EC2Role: 'role-3',
  LambdaRole: 'role-4',
} as const;

export const PolicyNodeID = {
  BillingPolicy: 'policy-1',
  S3ReadPolicy: 'policy-2',
  ChatImagesS3WritePolicy: 'policy-3',
  ChatImagesS3ReadPolicy: 'policy-4',
  AssumeRolePolicy: 'policy-5',
} as const;
