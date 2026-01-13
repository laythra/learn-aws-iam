import cloudfrontReadPolicySchema from './schemas/policy/cloudfront-read-policy-schema.json';
import dynamoReadWritePolicySchema from './schemas/policy/dynamo-db-read-write-policy-schema.json';
import s3ReadPolicySchema from './schemas/policy/s3-read-policy-schema.json';
import s3ReadWritePolicySchema from './schemas/policy/s3-read-write-policy-schema.json';
import { PolicyNodeID } from './types/node-id-enums';
import { AJV_COMPILER } from '@/lib/iam/iam-policy-validator';

export const ValidateFunctions = {
  [PolicyNodeID.S3ReadPolicy]: () => AJV_COMPILER.compile(s3ReadPolicySchema),
  [PolicyNodeID.S3ReadWritePolicy]: () => AJV_COMPILER.compile(s3ReadWritePolicySchema),
  [PolicyNodeID.DynamoDBReadWritePolicy]: () => AJV_COMPILER.compile(dynamoReadWritePolicySchema),
  [PolicyNodeID.CloudFrontReadPolicy]: () => AJV_COMPILER.compile(cloudfrontReadPolicySchema),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
