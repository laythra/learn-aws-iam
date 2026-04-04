import { DATA_SCIENTISTS_POLICY_DOCUMENT } from '../data-scientists-policy';
import { DEVELOPERS_POLICY_DOCUMENT } from '../developers-policy';
import { INTERNS_POLICY_DOCUMENT } from '../interns-policy';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { AccessLevel, CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const IN_LEVEL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.DeveloperPolicy,
    label: 'DevelopersAccess',
    content: DEVELOPERS_POLICY_DOCUMENT,
    granted_accesses: [
      {
        target_node: ResourceNodeID.CustomerDataDynamoTable,
        target_handle: 'bottom',
        access_level: AccessLevel.Full,
      },
    ],
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    editable: false,
  },
  {
    id: PolicyNodeID.DataScientistPolicy,
    label: 'DataScientistsAccess',
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
    editable: false,
  },
  {
    id: PolicyNodeID.InternPolicy,
    label: 'InternsAccess',
    content: INTERNS_POLICY_DOCUMENT,
    granted_accesses: [],
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    editable: false,
  },
];

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMIdentityPolicyNode[] = IN_LEVEL_POLICY_NODES.map(
  nodeData => createIdentityPolicyNode({ dataOverrides: nodeData })
);
