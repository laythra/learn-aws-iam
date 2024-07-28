import { type Node, HandleProps, Position } from 'reactflow';

import { INITIAL_USERS_INFO } from '../config';
import type { IAMUserNodeData } from '@/types';
import { IAMNodeEntity, IAMNodeImage } from '@/types';

export const USER_NODES: Node<IAMUserNodeData>[] = INITIAL_USERS_INFO.map(
  ({ id, label }, index) => ({
    id,
    position: { x: 200 + index * 200, y: 500 },
    data: {
      id,
      label,
      entity: IAMNodeEntity.User,
      image: IAMNodeImage.User,
      description: '',
      associated_policies: [],
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
        { id: Position.Left, type: 'source', position: Position.Left },
      ] as HandleProps[],
    },
    type: 'iam_default',
    draggable: true,
  })
);
