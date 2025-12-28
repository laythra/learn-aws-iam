import { Position } from '@xyflow/react';

import { createNodeFactory } from './create-node-factory';
import { HandleID, IAMNodeEntity, IAMNodeImage } from '@/types/iam-enums';
import { IAMRoleNode } from '@/types/iam-node-types';

export const createRoleNode = createNodeFactory<IAMRoleNode['data'], IAMNodeEntity.Role>({
  type: 'role',
  entity: IAMNodeEntity.Role,
  image: IAMNodeImage.Role,
  defaultHandles: [
    { id: HandleID.Top, type: 'source', position: Position.Top },
    { id: HandleID.Right, type: 'source', position: Position.Right },
    { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
    { id: HandleID.Left, type: 'source', position: Position.Left },
  ],
  initial_position: 'bottom-center',
});
