import { Position } from '@xyflow/react';

import { createNodeFactory } from './create-node-factory';
import { HandleID, IAMNodeEntity, IAMNodeImage } from '@/types/iam-enums';
import { IAMOUNode } from '@/types/iam-node-types';

export const createOUNode = createNodeFactory<IAMOUNode['data'], IAMNodeEntity.OU>({
  type: 'ou',
  entity: IAMNodeEntity.OU,
  image: IAMNodeImage.OU,
  defaultHandles: [
    { id: HandleID.Top, type: 'source', position: Position.Top },
    { id: HandleID.Right, type: 'source', position: Position.Right },
    { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
    { id: HandleID.Left, type: 'source', position: Position.Left },
  ],
  initial_position: 'bottom-center',
});
