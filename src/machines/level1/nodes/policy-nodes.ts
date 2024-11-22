import { type Node } from 'reactflow';

import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/policy-node-factory';
import type { IAMPolicyNodeData } from '@/types';
import { AccessLevel, IAMNodeImage } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.S3ReadPolicy,
    label: 'public-images',
    initial_position: 'center',
    image: IAMNodeImage.Policy,
    granted_accesses: { [ResourceNodeID.PublicImagesS3Bucket]: AccessLevel.Read },
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] =
  TUTORIAL_POLICY_NODES.map(createPolicyNode);
