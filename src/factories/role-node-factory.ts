import type { HandleProps } from '@xyflow/react';
import { Position } from '@xyflow/react';
import _ from 'lodash';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import { IAMNodeImage, IAMNodeEntity, IAMRoleNode } from '@/types';

export const TEMPLATE_ROLE_NODE: IAMRoleNode = {
  id: 'iam_role',
  position: { x: 0, y: 0 },
  draggable: true,
  type: 'role',
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
    trust_policy_content: '',
    animations: getNodeAnimations(NODE_ANIMATION_ID.ShimmerBackground),
  },
};

export function createRoleNode(props: Partial<IAMRoleNode['data']>): IAMRoleNode {
  return _.merge(
    {},
    TEMPLATE_ROLE_NODE,
    { data: props },
    { id: props.id, deletable: props.unnecessary_node }
  );
}
