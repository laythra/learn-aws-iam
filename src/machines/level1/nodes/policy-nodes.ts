import { type Node } from 'reactflow';

import { PolicyNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/policy-node-factory';
import type { IAMPolicyNodeData } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.S3ReadPolicy,
    label: 'public-images',
    initial_position: 'center',
    image: IAMNodeImage.Policy,
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] =
  TUTORIAL_POLICY_NODES.map(createPolicyNode);
