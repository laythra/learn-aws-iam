import { type Node, HandleProps, Position } from 'reactflow';

import { INITIAL_RESOURCES_INFO } from '../config';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeEntity } from '@/types';

export const RESOURCE_NODES = INITIAL_RESOURCES_INFO.map((resource, index) => ({
  id: resource.id,
  position: { x: 400 + index * 200, y: 250 },
  data: {
    id: resource.id,
    label: resource.name,
    entity: IAMNodeEntity.Resource,
    image: resource.image,
    resources_affected: ['jaja'],
    description: '',
    handles: [
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Bottom, type: 'target', position: Position.Bottom },
    ] as HandleProps[],
  } as IAMResourceNodeData,
  type: 'iam_default',
  draggable: true,
})) as Node<IAMResourceNodeData>[];
