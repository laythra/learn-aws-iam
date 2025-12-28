import { Position } from '@xyflow/react';

import { createNodeFactory } from './create-node-factory';
import { HandleID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMAccountNode } from '@/types/iam-node-types';

export const createAccountNode = createNodeFactory<IAMAccountNode['data'], IAMNodeEntity.Account>({
  type: 'account',
  entity: IAMNodeEntity.Account,
  image: 'NONE',
  height: 300,
  width: 800,
  defaultHandles: [{ id: HandleID.Top, type: 'source', position: Position.Top }],
  initial_position: 'bottom-center',
});
