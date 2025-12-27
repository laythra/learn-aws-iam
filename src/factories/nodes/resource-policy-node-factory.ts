import { Position } from '@xyflow/react';

import { createNodeFactory } from './create-node-factory';
import { HandleID, IAMNodeEntity, IAMNodeImage } from '@/types/iam-enums';
import { IAMResourcePolicyNode } from '@/types/iam-node-types';

export const createResourcePolicyNode = createNodeFactory<
  IAMResourcePolicyNode['data'],
  IAMNodeEntity.ResourcePolicy
>({
  type: 'resource_policy',
  entity: IAMNodeEntity.ResourcePolicy,
  image: IAMNodeImage.Policy,
  defaultHandles: [
    { id: HandleID.Top, type: 'source', position: Position.Top },
    { id: HandleID.Right, type: 'source', position: Position.Right },
    { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
    { id: HandleID.Left, type: 'source', position: Position.Left },
  ],
  initial_position: 'bottom-center',
  additionalData: {
    granted_accesses: [],
    initial_position: 'center',
    editable: false,
    id: 'policy-1',
    content: '',
  },
});
