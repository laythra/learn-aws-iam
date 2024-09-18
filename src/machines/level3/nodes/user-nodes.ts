import _ from 'lodash';
import { type Node, HandleProps, Position } from 'reactflow';

import { Y_OFFSET as POLICY_NODE_Y_OFFSET } from './policy-nodes';
import { Y_OFFSET as RESOURCE_NODE_Y_OFFSET } from './resource-nodes';
import { theme } from '@/theme';
import type { IAMUserNodeData } from '@/types';
import { IAMNodeEntity, IAMNodeImage } from '@/types';

export const USER_NODE_X_OFFSET = theme.sizes.iamNodeWidthInPixels / 2;
export const USER_NODE_Y_OFFSET = (POLICY_NODE_Y_OFFSET + RESOURCE_NODE_Y_OFFSET) / 2;

export enum UserNodeID {
  User1 = 'Laith',
  User2 = 'Ali',
  User3 = 'Mohammed',
  User4 = 'Khalid',
}

export const TEMPLATE_USER_NODE: Node<IAMUserNodeData> = {
  id: 'iam_user',
  position: { x: USER_NODE_X_OFFSET, y: USER_NODE_Y_OFFSET },
  type: 'iam_default',
  draggable: true,
  data: {
    id: 'iam_user',
    label: 'IAM User',
    entity: IAMNodeEntity.User,
    handles: [
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Right, type: 'source', position: Position.Right },
      { id: Position.Left, type: 'source', position: Position.Left },
      { id: Position.Bottom, type: 'source', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.User,
    associated_policies: [],
    description: '',
  },
};

const IN_LEVEL_USER_NODES: Partial<IAMUserNodeData>[] = [
  {
    id: UserNodeID.User1,
    label: 'Laith',
    initial_position: 'left-center',
  },
  {
    id: UserNodeID.User2,
    label: 'Ali',
    initial_position: 'left-center',
  },
  {
    id: UserNodeID.User3,
    label: 'Mohammad',
    initial_position: 'right-center',
  },
  {
    id: UserNodeID.User4,
    label: 'Khalid',
    initial_position: 'right-center',
  },
];
export const INITIAL_IN_LEVEL_USER_NODES: Node<IAMUserNodeData>[] = IN_LEVEL_USER_NODES.map(
  ({ id, label, initial_position }, index) =>
    _.merge({}, TEMPLATE_USER_NODE, {
      id,
      position: { x: USER_NODE_X_OFFSET + index * USER_NODE_X_OFFSET * 2.5, y: USER_NODE_Y_OFFSET },
      data: {
        id,
        label,
        initial_position,
      } as Partial<IAMUserNodeData>,
    })
);

export const groupedByIdUsers = _.keyBy(INITIAL_IN_LEVEL_USER_NODES, 'id');
