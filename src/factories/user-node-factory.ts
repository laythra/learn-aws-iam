import { Position, type HandleProps } from '@xyflow/react';
import _ from 'lodash';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import { HandleID, IAMNodeEntity, IAMNodeImage, IAMUserNode } from '@/types';

export const TEMPLATE_USER_NODE: IAMUserNode = {
  id: 'iam_user',
  position: { x: 0, y: 0 },
  type: 'user',
  draggable: true,
  deletable: false,
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
    initial_position: 'top-center',
    animations: getNodeAnimations(NODE_ANIMATION_ID.ShimmerBackground),
  },
};

export function createUserNode(props: Partial<IAMUserNode['data']>): IAMUserNode {
  return _.merge(
    {},
    TEMPLATE_USER_NODE,
    { data: props },
    { id: props.id, deletable: props.unnecessary_node }
  );
}
