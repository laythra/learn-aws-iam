import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { AccessLevel, CommonLayoutGroupID, type IAMPolicyNode } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.Policy1,
    label: 'S3ReadAccess',
    content: JSON.stringify(INITIAL_POLICIES.S3_READ_ONLY_POLICY, null, 2),
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    granted_accesses: [
      {
        target_node: ResourceNodeID.S3Bucket,
        target_handle: 'bottom',
        access_level: AccessLevel.Read,
      },
    ],
    editable: false,
  },
];

const IN_LEVEL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.Policy1,
    label: 'S3ReadAccess',
    content: JSON.stringify(INITIAL_POLICIES.S3_READ_ONLY_POLICY, null, 2),
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    granted_accesses: [
      {
        target_node: ResourceNodeID.S3Bucket,
        target_handle: 'bottom',
        access_level: AccessLevel.Read,
      },
    ],
    editable: false,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: IAMPolicyNode[] = TUTORIAL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: nodeData.parent_id, draggable: false },
  })
);

export const INITIAL_IN_LEVEL_POLICY_NODES: IAMPolicyNode[] = IN_LEVEL_POLICY_NODES.map(nodeData =>
  createPolicyNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: nodeData.parent_id },
  })
);
