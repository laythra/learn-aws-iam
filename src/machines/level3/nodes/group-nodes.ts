import _ from 'lodash';
import { type Node, HandleProps, Position } from 'reactflow';

import { Y_OFFSET as POLICY_NODE_Y_OFFSET } from './policy-nodes';
import { Y_OFFSET as RESOURCE_NODE_Y_OFFSET } from './resource-nodes';
import { groupedByIdUsers, UserNodeID } from './user-nodes';
import { theme } from '@/theme';
import type { IAMGroupNodeData } from '@/types';
import { IAMNodeEntity, IAMNodeImage } from '@/types';

export const X_OFFSET = theme.sizes.iamNodeWidthInPixels;
export const GROUP_NODE_Y_OFFSET = (POLICY_NODE_Y_OFFSET + RESOURCE_NODE_Y_OFFSET) / 2;

export enum GroupNodeID {
  FrontendGroup = 'iam_group_1',
  BackendGroup = 'iam_group_2',
}

export const TEMPLATE_GROUP_NODE: Node<IAMGroupNodeData> = {
  id: 'iam_group',
  position: { x: X_OFFSET * 3, y: GROUP_NODE_Y_OFFSET },
  type: 'iam_default',
  draggable: true,
  data: {
    id: 'iam_group',
    label: 'IAM Group',
    entity: IAMNodeEntity.Group,
    handles: [
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Right, type: 'target', position: Position.Right },
      { id: Position.Bottom, type: 'target', position: Position.Bottom },
      { id: Position.Left, type: 'target', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.Group,
    attached_users: [],
    attached_policies: [],
    description: '',
  },
};

const IN_LEVEL_GROUP_NODES: Partial<IAMGroupNodeData>[] = [
  {
    id: GroupNodeID.FrontendGroup,
    label: 'frontend-team',
    initial_position: 'center',
    attached_users: [
      groupedByIdUsers[UserNodeID.User1].data,
      groupedByIdUsers[UserNodeID.User2].data,
    ],
  },
  {
    id: GroupNodeID.BackendGroup,
    label: 'backend-team',
    initial_position: 'center',
    attached_users: [
      groupedByIdUsers[UserNodeID.User3].data,
      groupedByIdUsers[UserNodeID.User4].data,
    ],
  },
];

export const INITIAL_IN_LEVEL_GROUP_NODES: Node<IAMGroupNodeData>[] = IN_LEVEL_GROUP_NODES.map(
  ({ id, label, initial_position, attached_users }) =>
    _.merge({}, TEMPLATE_GROUP_NODE, {
      id,
      data: {
        id,
        label,
        initial_position,
        attached_users,
      },
    })
);

export const INITIAL_GROUP_NODES = INITIAL_IN_LEVEL_GROUP_NODES;
