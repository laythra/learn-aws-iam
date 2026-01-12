import createRDSWithTagsPolicy from './schemas/policy/create-rds-with-tags-policy.json';
import manageTaggedRdsPolicy from './schemas/policy/manage-tagged-rds-policy.json';
import { PolicyNodeID } from './types/node-id-enums';
import { IAMNodeFilter } from '../utils/iam-node-filter';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';
import { AJV_COMPILER } from '@/lib/iam/iam-code-linter';

export const ObjectivesApplicableNodesFns = {
  paymentsTeamApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('team', 'payments-team')
      .build(),
  complianceTeamApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('team', 'compliance-team')
      .build(),
  analyticsTeamApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('team', 'analytics-team')
      .build(),
} as const;

export const ValidateFunctions = {
  [PolicyNodeID.TBACPolicy]: () => AJV_COMPILER.compile(createRDSWithTagsPolicy),
  [PolicyNodeID.RDSManagePolicy]: () => AJV_COMPILER.compile(manageTaggedRdsPolicy),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
export type ObjectivesApplicableNodesFnName = keyof typeof ObjectivesApplicableNodesFns;
