import { generateAssumeRolePermissionPolicySchema } from './schemas/assume-role-permission-policy-schema';
import dynamodbReadPolicySchema from './schemas/dynamodb-read-permission-policy-schema.json';
import dynamodbRoleTrustPolicy from './schemas/dynamodb-role-trust-policy-schema.json';
import { AccountID, PolicyNodeID, RoleNodeID } from './types/node-id-enums';
import { generateArn } from '@/lib/iam/arn-generator';
import { AJV_COMPILER } from '@/lib/iam/iam-policy-validator';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

export const ValidateFunctions = {
  [PolicyNodeID.TrustingAccountFinanceReportsReadPolicy]: () =>
    AJV_COMPILER.compile(dynamodbReadPolicySchema),
  [PolicyNodeID.TrustedAccountAssumeRolePolicy]: (nodes: IAMAnyNode[]) => {
    const roleNode = nodes.find(node => node.id === RoleNodeID.TrustingAccountDynamoDBReadRole)!;

    const roleArn = generateArn(IAMNodeEntity.Role, roleNode.data.label, AccountID.TrustingAccount);
    return AJV_COMPILER.compile(generateAssumeRolePermissionPolicySchema(roleArn));
  },
  [RoleNodeID.TrustingAccountDynamoDBReadRole]: () => AJV_COMPILER.compile(dynamodbRoleTrustPolicy),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
