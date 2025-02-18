import { type Node } from 'reactflow';

import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/policy-node-factory';
import type { IAMPolicyNodeData } from '@/types';
import { AccessLevel, IAMNodeImage } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.S3ReadPolicy,
    label: 'public-images',
    initial_position: 'bottom-left',
    image: IAMNodeImage.Policy,
    content: JSON.stringify(INITIAL_POLICIES.S3_READ_POLICY, null, 2),
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
