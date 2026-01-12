import { generateAssumeRolePolicySchema } from './schemas/policy/assume-role-policy-schema';
import dynamodbReadPolicySchema from './schemas/policy/dynamodb-read-policy-schema.json';
import dynamodbRoleTrustPolicy from './schemas/role/dynamodb-role-trust-policy-schema.json';
import { PolicyNodeID, RoleNodeID } from './types/node-id-enums';
import { generateArn } from '@/lib/iam/arn-generator';
import { AJV_COMPILER } from '@/lib/iam/iam-code-linter';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

export const ValidateFunctions = {
  [PolicyNodeID.TrustingAccountFinanceReportsReadPolicy]: () =>
    AJV_COMPILER.compile(dynamodbReadPolicySchema),
  [PolicyNodeID.TrustedAccountAssumeRolePolicy]: (nodes: IAMAnyNode[]) => {
    const roleNode = nodes.find(
      node => node.data.id === RoleNodeID.TrustingAccountDynamoDBReadRole
    )!;

    const roleArn = generateArn(IAMNodeEntity.Role, roleNode.data.label);
    return AJV_COMPILER.compile(generateAssumeRolePolicySchema(roleArn));
  },
  [RoleNodeID.TrustingAccountDynamoDBReadRole]: () => AJV_COMPILER.compile(dynamodbRoleTrustPolicy),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
