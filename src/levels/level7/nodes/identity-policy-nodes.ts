import { ResourcePolicyNodeID } from '../types/node-id-enums';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMIdentityPolicyNode } from '@/types/iam-node-types';

const TUTORIAL_POLICY_NODES: IAMNodeDataOverrides<IAMIdentityPolicyNode['data']>[] = [
  {
    id: ResourcePolicyNodeID.TutorialResourceBasedPolicy,
    label: 's3-read-access',
    granted_accesses: [],
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    editable: true,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES = TUTORIAL_POLICY_NODES.map(nodeInfo =>
  createIdentityPolicyNode({
    dataOverrides: nodeInfo,
  })
);
