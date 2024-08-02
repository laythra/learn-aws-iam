import _ from 'lodash';
import { type Node, HandleProps, Position } from 'reactflow';

import { Y_OFFSET as POLICY_NODE_Y_OFFSET } from './policy-nodes';
import { Y_OFFSET as RESOURCE_NODE_Y_OFFSET } from './resource-nodes';
import { INITIAL_USERS_INFO } from '../config';
import { theme } from '@/theme';
import type { IAMUserNodeData } from '@/types';
import { IAMNodeEntity, IAMNodeImage } from '@/types';

export const X_OFFSET = theme.sizes.iamNodeWidthInPixels / 2;
export const Y_OFFSET = (POLICY_NODE_Y_OFFSET + RESOURCE_NODE_Y_OFFSET) / 2;

export const TEMPLATE_USER_NODE: Node<IAMUserNodeData> = {
  id: 'iam_user',
  position: { x: 500, y: Y_OFFSET },
  type: 'iam_default',
  draggable: true,
  data: {
    id: 'iam_user',
    label: 'IAM User',
    entity: IAMNodeEntity.User,
    handles: [
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Bottom, type: 'target', position: Position.Bottom },
    ] as HandleProps[],
    image: IAMNodeImage.User,
    associated_policies: [],
    description: '',
  },
};

export const INITIAL_USER_NODES: Node<IAMUserNodeData>[] = INITIAL_USERS_INFO.map(
  ({ id, label }, index) =>
    _.merge({}, TEMPLATE_USER_NODE, {
      id,
      position: { x: X_OFFSET + index * X_OFFSET * 3, y: Y_OFFSET },
      data: {
        id,
        label,
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
