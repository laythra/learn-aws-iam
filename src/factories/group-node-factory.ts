import type { HandleProps } from '@xyflow/react';
import { Position } from '@xyflow/react';
import _ from 'lodash';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import { IAMNodeImage, IAMNodeEntity, IAMGroupNode, HandleID } from '@/types';

export const TEMPLATE_GROUP_NODE: IAMGroupNode = {
  id: 'iam_group',
  position: { x: 0, y: 0 },
  type: 'iam_group',
  draggable: true,
  deletable: false,
  data: {
    id: 'iam_group',
    label: 'IAM Group',
    entity: IAMNodeEntity.Group,
    handles: [
      { id: HandleID.Top, type: 'source', position: Position.Top },
      { id: HandleID.Right, type: 'source', position: Position.Right },
      { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
      { id: HandleID.Left, type: 'source', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.Group,
    initial_position: 'bottom-center',
    animations: getNodeAnimations(NODE_ANIMATION_ID.ShimmerBackground),
  },
};

export function createGroupNode(props: Partial<IAMGroupNode['data']>): IAMGroupNode {
  return _.merge(
    {},
    TEMPLATE_GROUP_NODE,
    { data: props },
    { id: props.id, deletable: props.unnecessary_node }
  );
}
