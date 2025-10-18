import { generateAssumeRolePolicySchema } from './schemas/policy/delegating-permissions-policy';
import elasticacheManagementPolicySchema from './schemas/policy/elasticcache-prod-management-policy.json';
import readSecretsPermissionBoundarySchema from './schemas/policy/read-secrets-permission-boundary.json';
import { PermissionBoundaryID, PolicyNodeID } from './types/node-id-enums';
import { IAMNodeFilter } from '../utils/iam-node-filter';
import { IAMAnyNode, IAMNodeEntity } from '@/types';
import { generateArn } from '@/utils/arn-generator';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const ValidateFunctions = {
  [PolicyNodeID.S3WriteAccessPolicy]: (nodes: IAMAnyNode[]) => {
    const pbNode = nodes.find(
      node => node.data.id === PermissionBoundaryID.SecretsReadingPermissionBoundary
    )!;

    const pbArn = generateArn(IAMNodeEntity.PermissionBoundary, pbNode.data.label);
    return AJV_COMPILER.compile(generateAssumeRolePolicySchema(pbArn));
  },
  [PermissionBoundaryID.SecretsReadingPermissionBoundary]: () =>
    AJV_COMPILER.compile(readSecretsPermissionBoundarySchema),
  [PolicyNodeID.ElasticCacheManagementPolicy]: () =>
    AJV_COMPILER.compile(elasticacheManagementPolicySchema),
} as const;

export const ObjectivesApplicableNodesFns = {
  notificationsSquadApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('squad', 'notifications')
      .build(),
  searchSquadApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('squad', 'search')
      .build(),
  paymentsSquadApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('squad', 'payments')
      .build(),
} as const;
export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
