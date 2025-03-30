import { uniqueId } from 'lodash';

export const UserNodeID = {
  FinanceUser: uniqueId('user-'),
} as const;

export const ResourceNodeID = {
  BillingAndCostManagement: uniqueId('resource-billing-'),
  FinanceS3Bucket: uniqueId('resource-s3bucket-'),
  LambdaFunction: uniqueId('resource-lambda-'),
  UsersCertificatesS3Bucket: uniqueId('resource-s3bucket-'),
  TimeshiftLabsEC2Instance: uniqueId('resource-ec2-'),
} as const;

export const RoleNodeID = {
  FinanceAuditorRole: uniqueId('role-'),
  S3ReadAccessRole: uniqueId('role-'),
  EC2Role: uniqueId('role-'),
  LambdaRole: uniqueId('role-'),
} as const;

export const PolicyNodeID = {
  BillingPolicy: uniqueId('policy-'),
  S3ReadPolicy: uniqueId('policy-'),
  UsersCertificatesS3WritePolicy: uniqueId('policy-'),
  UsersCertificatesS3ReadPolicy: uniqueId('policy-'),
} as const;
