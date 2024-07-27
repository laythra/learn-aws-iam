import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { INITIAL_POLICIES_INFO } from '../config';
import { IAMPolicyNodeData, IAMNodeImage } from '@/types';

export const POLICY_NODES = INITIAL_POLICIES_INFO.map((policy, index) => ({
  id: policy.id,
  position: { x: 200 + index * 200, y: 250 },
  data: {
    id: policy.id,
    label: policy.name,
    entity: 'IAM Policy',
    image: IAMNodeImage.Policy,
    code: policy.code,
    resources_affected: ['jaja'],
    description: '',
    handles: [
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Bottom, type: 'target', position: Position.Bottom },
    ] as HandleProps[],
  } as IAMPolicyNodeData,
  type: 'iam_default',
  draggable: true,
})) as Node<IAMPolicyNodeData>[];
