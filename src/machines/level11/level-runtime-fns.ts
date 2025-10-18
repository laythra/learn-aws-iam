import { generateAssumeRolePolicySchema } from './schemas/policy/delegating-permissions-policy';
import readSecretsPermissionBoundarySchema from './schemas/policy/read-secrets-permission-boundary.json';
import { PermissionBoundaryID, PolicyNodeID } from './types/node-id-enums';
import { IAMAnyNode, IAMNodeEntity } from '@/types';
import { generateArn } from '@/utils/arn-generator';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const ValidateFunctions = {
  [PolicyNodeID.AccessDelegationPolicy]: (nodes: IAMAnyNode[]) => {
    const pbNode = nodes.find(
      node => node.data.id === PermissionBoundaryID.SecretsReadingPermissionBoundary
    )!;

    const pbArn = generateArn(IAMNodeEntity.PermissionBoundary, pbNode.data.label);
    return AJV_COMPILER.compile(generateAssumeRolePolicySchema(pbArn));
  },
  [PermissionBoundaryID.SecretsReadingPermissionBoundary]: () =>
    AJV_COMPILER.compile(readSecretsPermissionBoundarySchema),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
