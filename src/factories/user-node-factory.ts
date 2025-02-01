import _ from 'lodash';
import { Position, type HandleProps, type Node } from 'reactflow';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import { type IAMUserNodeData, HandleID, IAMNodeEntity, IAMNodeImage } from '@/types';

export const TEMPLATE_USER_NODE: Node<IAMUserNodeData> = {
  id: 'iam_user',
  position: { x: 0, y: 0 },
  type: 'iam_default',
  draggable: true,
  data: {
    id: 'iam_user',
    label: 'IAM User',
    entity: IAMNodeEntity.User,
    handles: [
      { id: HandleID.Top, type: 'source', position: Position.Top },
      { id: HandleID.Right, type: 'source', position: Position.Right },
      { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
      { id: HandleID.Left, type: 'source', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.User,
    associated_policies: [],
    initial_position: 'top-center',
    associated_roles: [],
    animations: getNodeAnimations(NODE_ANIMATION_ID.ShimmerBackground),
  },
};

export function createUserNode(props: Partial<IAMUserNodeData>): Node<IAMUserNodeData> {
  props.id ||= Date.now().toString();

  return _.merge({}, TEMPLATE_USER_NODE, { data: props }, { id: props.id });
}
