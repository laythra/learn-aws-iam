import { DATA_SCIENTISTS_POLICY_DOCUMENT } from '../policy_role_documents/data-scientists-policy';
import { DEVELOPERS_POLICY_DOCUMENT } from '../policy_role_documents/developers-policy';
import { INTERNS_POLICY_DOCUMENT } from '../policy_role_documents/interns-policy';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { AccessLevel, CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMPolicyNode } from '@/types/iam-node-types';

const IN_LEVEL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
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
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
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
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    editable: true,
  },
  {
    id: PolicyNodeID.InternPolicy,
    label: 'interns-access',
    content: INTERNS_POLICY_DOCUMENT,
    granted_accesses: [],
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    editable: true,
  },
];

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMPolicyNode[] = IN_LEVEL_POLICY_NODES.map(nodeData =>
  createPolicyNode({ dataOverrides: nodeData })
);
