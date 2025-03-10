import _ from 'lodash';
import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import { IAMNodeImage, IAMNodeEntity, IAMRoleNodeData } from '@/types';

export const TEMPLATE_ROLE_NODE: Node<IAMRoleNodeData> = {
  id: 'iam_role',
  position: { x: 0, y: 0 },
  type: 'iam_default',
  draggable: true,
  data: {
    id: 'iam_role',
    label: 'IAM Role',
    entity: IAMNodeEntity.Role,
    handles: [
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Right, type: 'source', position: Position.Right },
      { id: Position.Bottom, type: 'target', position: Position.Bottom },
      { id: Position.Left, type: 'source', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.Role,
    initial_position: 'center',
    editable: true,
    associated_users: [],
    associated_policies: [],
    associated_resources: [],
    // trust_policy_content: '',
    animations: getNodeAnimations(NODE_ANIMATION_ID.ShimmerBackground),
  },
};

export function createRoleNode(props: Partial<IAMRoleNodeData>): Node<IAMRoleNodeData> {
  return _.merge({}, TEMPLATE_ROLE_NODE, { data: props }, { id: props.id });
}
