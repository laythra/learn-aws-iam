import { generateRdsManagePolicySchema } from './schemas/per-team-rds-manage-policy';
import rdsSharedManagePolicySchema from './schemas/rds-shared-manage-policy.json';
import { PolicyNodeID } from './types/node-ids';
import { IAMNodeFilter } from '../utils/filters/iam-node-filter';
import { AJV_COMPILER } from '@/domain/iam-policy-validator';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

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
  [PolicyNodeID.RDSManagePolicy1]: () => {
    const schema = generateRdsManagePolicySchema('peach-team', 'PEACHDB123');
    return AJV_COMPILER.compile(schema);
  },
  [PolicyNodeID.RDSManagePolicy2]: () => {
    const schema = generateRdsManagePolicySchema('bowser-force', 'BOWSERDB123');
    return AJV_COMPILER.compile(schema);
  },
  [PolicyNodeID.RDSSharedPolicy]: () => AJV_COMPILER.compile(rdsSharedManagePolicySchema),
} as const;

export type ObjectivesApplicableNodesFnName = keyof typeof ObjectivesApplicableNodesFns;
export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
