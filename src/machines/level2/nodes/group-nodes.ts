import { type Node, HandleProps, Position } from 'reactflow';

import { Y_OFFSET as POLICY_NODE_Y_OFFSET } from './policy-nodes';
import { Y_OFFSET as RESOURCE_NODE_Y_OFFSET } from './resource-nodes';
import { theme } from '@/theme';
import type { IAMGroupNodeData } from '@/types';
import { IAMNodeEntity, IAMNodeImage } from '@/types';

export const X_OFFSET = theme.sizes.iamNodeWidthInPixels;
export const GROUP_NODE_Y_OFFSET = (POLICY_NODE_Y_OFFSET + RESOURCE_NODE_Y_OFFSET) / 2;

export const TEMPLATE_GROUP_NODE: Node<IAMGroupNodeData> = {
  id: 'iam_group',
  position: { x: X_OFFSET * 3, y: GROUP_NODE_Y_OFFSET },
  type: 'iam_default',
  draggable: false,
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

export const INITIAL_GROUP_NODES: Node<IAMGroupNodeData>[] = [];
