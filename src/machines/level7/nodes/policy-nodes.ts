import { ResourcePolicyNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: ResourcePolicyNodeID.TutorialResourceBasedPolicy,
    label: 's3-read-access',
    granted_accesses: [],
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    editable: true,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES = TUTORIAL_POLICY_NODES.map(nodeInfo =>
  createPolicyNode({
    dataOverrides: nodeInfo,
  })
);
