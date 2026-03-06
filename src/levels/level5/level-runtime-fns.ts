import ec2RoleSchema from './schemas/ec2-role-schema.json';
import financeAuditorPolicySchema from './schemas/finance-auditor-role-schema.json';
import lambdaRoleSchema from './schemas/lambda-role-schema.json';
import { RoleNodeID } from './types/node-id-enums';
import { AJV_COMPILER } from '@/lib/iam/iam-policy-validator';

export const ValidateFunctions = {
  [RoleNodeID.S3ReadAccessRole]: () => AJV_COMPILER.compile(financeAuditorPolicySchema),
  [RoleNodeID.EC2Role]: () => AJV_COMPILER.compile(ec2RoleSchema),
  [RoleNodeID.LambdaRole]: () => AJV_COMPILER.compile(lambdaRoleSchema),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
