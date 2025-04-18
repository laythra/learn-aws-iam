import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { AccessLevel, type IAMPolicyNode } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNode['data']>[] = [
  {
    id: PolicyNodeID.TutorialResourceBasedPolicy,
    label: 's3-read-access',
    granted_accesses: [
      {
        target_node: ResourceNodeID.TutorialS3Bucket,
        target_handle: 'bottom',
        access_level: AccessLevel.Read,
      },
    ],
    initial_position: 'bottom-center',
    editable: true,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES = TUTORIAL_POLICY_NODES.map(nodeInfo =>
  createPolicyNode({
    dataOverrides: nodeInfo,
  })
);
