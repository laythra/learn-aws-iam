import { generateAssumeRolePolicySchema } from './schemas/assume-role-policy-schema';
import ec2RoleSchema from './schemas/ec2-role-schema.json';
import lambdaRoleSchema from './schemas/lambda-role-schema.json';
import s3ReadAccessRoleSchema from './schemas/s3-read-access-role-schema.json';
import { PolicyNodeID, RoleNodeID } from './types/node-ids';
import { generateArn } from '@/domain/arn-generator';
import { AJV_COMPILER } from '@/domain/iam-policy-validator';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

export const ValidateFunctions = {
  [PolicyNodeID.AssumeRolePolicy]: (nodes: IAMAnyNode[]) => {
    const roleNode = nodes.find(node => node.id === RoleNodeID.S3ReadAccessRole)!;
    const roleArn = generateArn(IAMNodeEntity.Role, roleNode.data.label);
    return AJV_COMPILER.compile(generateAssumeRolePolicySchema(roleArn));
  },

  [RoleNodeID.S3ReadAccessRole]: () => AJV_COMPILER.compile(s3ReadAccessRoleSchema),
  [RoleNodeID.EC2Role]: () => AJV_COMPILER.compile(ec2RoleSchema),
  [RoleNodeID.LambdaRole]: () => AJV_COMPILER.compile(lambdaRoleSchema),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
