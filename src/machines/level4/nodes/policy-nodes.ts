import type { Node } from 'reactflow';

import { policyToUserAssocations } from './initial-associations';
import { DATA_SCIENTISTS_POLICY_DOCUMENT } from '../policy_role_documents/data-scientists-policy';
import { DEVELOPERS_POLICY_DOCUMENT } from '../policy_role_documents/developers-policy';
import { INTERNS_POLICY_DOCUMENT } from '../policy_role_documents/interns-policy';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/policy-node-factory';
import { attachUsersToPolicies } from '@/machines/utils/association-manager';
import { AccessLevel, IAMPolicyNodeData } from '@/types';

const IN_LEVEL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.DeveloperPolicy,
    label: 'developers-access',
    content: DEVELOPERS_POLICY_DOCUMENT,
    granted_accesses: {
      [ResourceNodeID.CustomerDataDynamoTable]: AccessLevel.ReadWrite,
      [ResourceNodeID.AnalyticsDataDynanoTable]: AccessLevel.ReadWrite,
    },
    initial_position: 'bottom-center',
    // TODO: Add associated users IDs
  },
  {
    id: PolicyNodeID.DataScientistPolicy,
    label: 'data-scientists-access',
    content: DATA_SCIENTISTS_POLICY_DOCUMENT,
    granted_accesses: {
      [ResourceNodeID.CustomerDataDynamoTable]: AccessLevel.ReadWrite,
      [ResourceNodeID.AnalyticsDataDynanoTable]: AccessLevel.ReadWrite,
    },
    initial_position: 'bottom-center',
  },
  {
    id: PolicyNodeID.InternPolicy,
    label: 'interns-access',
    content: INTERNS_POLICY_DOCUMENT,
    granted_accesses: {},
    initial_position: 'bottom-center',
  },
];

export const INITIAL_IN_LEVEL_POLICY_NODES: Node<IAMPolicyNodeData>[] = attachUsersToPolicies(
  IN_LEVEL_POLICY_NODES.map(createPolicyNode),
  policyToUserAssocations
);

export const INITIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] = INITIAL_IN_LEVEL_POLICY_NODES;
