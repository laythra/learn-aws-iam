import rdsSharedManagePolicySchema from './schemas/policy/rds-shared-manage-policy.json';
import rds1ManagePolicySchema from './schemas/policy/rds1-manage-policy.json';
import rds2managePolicySchema from './schemas/policy/rds2-manage-policy.json';
import { PolicyNodeID } from './types/node-id-enums';
import { IAMNodeFilter } from '../utils/iam-node-filter';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';
import { AJV_COMPILER } from '@/lib/iam/iam-code-linter';

export const ObjectivesApplicableNodesFns = {
  peachTeamApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('application', 'peach-team')
      .build(),
  bowserForceApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('application', 'bowser-force')
      .build(),
} as const;

export const ValidateFunctions = {
  [PolicyNodeID.RDSManagePolicy1]: () => AJV_COMPILER.compile(rds1ManagePolicySchema),
  [PolicyNodeID.RDSManagePolicy2]: () => AJV_COMPILER.compile(rds2managePolicySchema),
  [PolicyNodeID.RDSSharedPolicy]: () => AJV_COMPILER.compile(rdsSharedManagePolicySchema),
} as const;

export type ObjectivesApplicableNodesFnName = keyof typeof ObjectivesApplicableNodesFns;
export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
