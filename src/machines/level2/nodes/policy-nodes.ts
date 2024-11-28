import { type Node } from 'reactflow';

import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyNode } from '@/factories/policy-node-factory';
import type { IAMPolicyNodeData } from '@/types';
import { AccessLevel, IAMNodeImage } from '@/types';

const POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.PolicyNode1,
    label: PolicyNodeID.PolicyNode1,
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    granted_accesses: [
      {
        access_level: AccessLevel.Read,
        target_handle: 'bottom',
        target_node: ResourceNodeID.S3Bucket,
      },
    ],
  },
  {
    id: PolicyNodeID.PolicyNode2,
    label: PolicyNodeID.PolicyNode2,
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    granted_accesses: [
      {
        access_level: AccessLevel.Read,
        target_handle: 'bottom',
        target_node: ResourceNodeID.DynamoDBTable,
      },
    ],
  },
  {
    id: PolicyNodeID.PolicyNode3,
    label: PolicyNodeID.PolicyNode3,
    initial_position: 'bottom-center',
    image: IAMNodeImage.Policy,
    granted_accesses: [
      {
        access_level: AccessLevel.Read,
        target_handle: 'bottom',
        target_node: ResourceNodeID.EC2Instance,
      },
    ],
  },
];

export const INITIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] = POLICY_NODES.map(createPolicyNode);
