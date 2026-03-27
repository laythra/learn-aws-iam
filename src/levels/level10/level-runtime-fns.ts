import createEC2WithTagsPolicy from './schemas/create-ec2-with-tags-policy.json';
import manageTaggedEC2Policy from './schemas/manage-tagged-ec2-policy.json';
import { PolicyNodeID } from './types/node-ids';
import { IAMNodeFilter } from '../utils/filters/iam-node-filter';
import { AJV_COMPILER } from '@/domain/iam-policy-validator';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

export const ObjectivesApplicableNodesFns = {
  paymentsTeamApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('application', 'payments-team')
      .build(),
  complianceTeamApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('application', 'compliance-team')
      .build(),
  analyticsTeamApplicableNodes: (nodes: IAMAnyNode[]) =>
    IAMNodeFilter.create()
      .fromNodes(nodes)
      .whereEntityIs(IAMNodeEntity.User)
      .whereHasTag('application', 'analytics-team')
      .build(),
} as const;

export const ValidateFunctions = {
  [PolicyNodeID.TBACPolicy]: () => AJV_COMPILER.compile(createEC2WithTagsPolicy),
  [PolicyNodeID.EC2ManagePolicy]: () => AJV_COMPILER.compile(manageTaggedEC2Policy),
} as const;

export type ValidateFunctionsFnName = keyof typeof ValidateFunctions;
export type ObjectivesApplicableNodesFnName = keyof typeof ObjectivesApplicableNodesFns;
