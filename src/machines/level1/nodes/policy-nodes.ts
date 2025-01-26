import { type Node } from 'reactflow';

import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/policy-node-factory';
import type { IAMPolicyNodeData } from '@/types';
import { AccessLevel, HandleID, IAMNodeImage } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.S3ReadPolicy,
    label: 'public-images',
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    granted_accesses: [
      {
        target_node: ResourceNodeID.PublicImagesS3Bucket,
        target_handle: 'top',
        source_handle: 'bottom',
        access_level: AccessLevel.Read,
      },
    ],
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] =
  TUTORIAL_POLICY_NODES.map(createPolicyNode);
