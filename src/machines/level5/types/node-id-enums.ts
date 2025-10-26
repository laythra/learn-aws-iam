import uniqueId from 'lodash/uniqueId.js';

export const UserNodeID = {
  FinanceUser: uniqueId('user-'),
} as const;

export const ResourceNodeID = {
  BillingAndCostManagement: uniqueId('resource-billing-'),
  FinanceS3Bucket: uniqueId('resource-s3bucket-'),
  LambdaFunction: uniqueId('resource-lambda-'),
  ChatImagesS3Bucket: uniqueId('resource-s3bucket-'),
  TimeshiftLabsEC2Instance: uniqueId('resource-ec2-'),
} as const;

export const RoleNodeID = {
  FinanceAuditorRole: 'role-1',
  S3ReadAccessRole: 'role-2',
  EC2Role: 'role-3',
  LambdaRole: 'role-4',
} as const;

export const PolicyNodeID = {
  BillingPolicy: uniqueId('policy-'),
  S3ReadPolicy: uniqueId('policy-'),
  ChatImagesS3WritePolicy: uniqueId('policy-'),
  ChatImagesS3ReadPolicy: uniqueId('policy-'),
} as const;
