import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { INITIAL_POLICIES_INFO } from '../config';
import { IAMPolicyNodeData, IAMNodeImage, IAMNodeEntity } from '@/types';

export const POLICY_NODES: Node<IAMPolicyNodeData>[] = INITIAL_POLICIES_INFO.map(
  ({ id, label, code, resources_affected }, index) => ({
    id,
    position: { x: 200 + index * 200, y: 250 },
    data: {
      id,
      label,
      entity: IAMNodeEntity.Policy,
      image: IAMNodeImage.Policy,
      code,
      resources_affected,
      description: '',
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
    },
    type: 'iam_default',
    draggable: true,
  })
);
