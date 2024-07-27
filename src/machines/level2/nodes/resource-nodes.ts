import { type Node, HandleProps, Position } from 'reactflow';

import { INITIAL_RESOURCES_INFO } from '../config';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeEntity } from '@/types';

export const RESOURCE_NODES: Node<IAMResourceNodeData>[] = INITIAL_RESOURCES_INFO.map(
  ({ id, label, image }, index) => ({
    id,
    position: { x: 200 + index * 200, y: 100 },
    data: {
      id,
      label,
      entity: IAMNodeEntity.Resource,
      image,
      resources_affected: ['jaja'],
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
