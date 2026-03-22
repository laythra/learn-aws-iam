import ec2RoleSchema from './schemas/ec2-role-schema.json';
import lambdaRoleSchema from './schemas/lambda-role-schema.json';
import s3ReadAccessRoleSchema from './schemas/s3-read-access-role-schema.json';
import { RoleNodeID } from './types/node-ids';
import { AJV_COMPILER } from '@/domain/iam-policy-validator';

export const ValidateFunctions = {
  [RoleNodeID.S3ReadAccessRole]: () => AJV_COMPILER.compile(s3ReadAccessRoleSchema),
  [RoleNodeID.EC2Role]: () => AJV_COMPILER.compile(ec2RoleSchema),
  [RoleNodeID.LambdaRole]: () => AJV_COMPILER.compile(lambdaRoleSchema),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
