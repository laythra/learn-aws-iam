import { Position } from '@xyflow/react';

import { createNodeFactory } from './create-node-factory';
import { HandleID, IAMNodeEntity, IAMNodeImage, IAMGroupNode } from '@/types';

export const createGroupNode = createNodeFactory<IAMGroupNode['data'], IAMNodeEntity.Group>({
  type: 'iam_group',
  entity: IAMNodeEntity.Group,
  image: IAMNodeImage.Group,
  defaultHandles: [
    { id: HandleID.Top, type: 'source', position: Position.Top },
    { id: HandleID.Right, type: 'source', position: Position.Right },
    { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
    { id: HandleID.Left, type: 'source', position: Position.Left },
  ],
  initial_position: 'bottom-center',
});
