import type { Node } from 'reactflow';

import { DATA_SCIENTISTS_POLICY_DOCUMENT } from '../policy_role_documents/data-scientists-policy';
import { DEVELOPERS_POLICY_DOCUMENT } from '../policy_role_documents/developers-policy';
import { INTERNS_POLICY_DOCUMENT } from '../policy_role_documents/interns-policy';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/policy-node-factory';
import { AccessLevel, IAMPolicyNodeData } from '@/types';

const IN_LEVEL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.DeveloperPolicy,
    label: 'developers-access',
    content: DEVELOPERS_POLICY_DOCUMENT,
    granted_accesses: [
      {
        target_node: ResourceNodeID.CustomerDataDynamoTable,
        target_handle: 'bottom',
        access_level: AccessLevel.Full,
      },
    ],
    initial_position: 'bottom-center',
    editable: true,
  },
  {
    id: PolicyNodeID.DataScientistPolicy,
    label: 'data-scientists-access',
    content: DATA_SCIENTISTS_POLICY_DOCUMENT,
    granted_accesses: [
      {
        target_node: ResourceNodeID.CustomerDataDynamoTable,
        target_handle: 'bottom',
        access_level: AccessLevel.ReadWrite,
      },
      {
        target_node: ResourceNodeID.AnalyticsDataDynamoTable,
        target_handle: 'bottom',
        access_level: AccessLevel.ReadWrite,
      },
    ],
    initial_position: 'bottom-center',
    editable: true,
  },
  {
    id: PolicyNodeID.InternPolicy,
    label: 'interns-access',
    content: INTERNS_POLICY_DOCUMENT,
    granted_accesses: [],
    initial_position: 'bottom-center',
    editable: true,
  },
];

export const INITIAL_IN_LEVEL_POLICY_NODES: Node<IAMPolicyNodeData>[] =
  IN_LEVEL_POLICY_NODES.map(createPolicyNode);
