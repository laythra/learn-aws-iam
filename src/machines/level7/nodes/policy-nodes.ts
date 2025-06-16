import { ResourceNodeID, ResourcePolicyNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { AccessLevel, CommonLayoutGroupID, type IAMPolicyNode } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: ResourcePolicyNodeID.TutorialResourceBasedPolicy,
    label: 's3-read-access',
    granted_accesses: [
      {
        target_node: ResourceNodeID.TutorialS3Bucket,
        target_handle: 'bottom',
        access_level: AccessLevel.Read,
      },
    ],
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    editable: true,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES = TUTORIAL_POLICY_NODES.map(nodeInfo =>
  createPolicyNode({
    dataOverrides: nodeInfo,
  })
);
