import _ from 'lodash';
import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { IAMGroupNodeData, IAMNodeImage, IAMNodeEntity } from '@/types';

export const TEMPLATE_GROUP_NODE: Node<IAMGroupNodeData> = {
  id: 'iam_group',
  position: { x: 0, y: 0 },
  type: 'iam_default',
  draggable: true,
  deletable: false,
  data: {
    id: 'iam_group',
    label: 'IAM Group',
    entity: IAMNodeEntity.Group,
    handles: [
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Right, type: 'source', position: Position.Right },
      { id: Position.Left, type: 'source', position: Position.Left },
      { id: Position.Bottom, type: 'target', position: Position.Bottom },
    ] as HandleProps[],
    image: IAMNodeImage.Group,
    initial_position: 'bottom-center',
  },
};

export function createGroupNode(props: Partial<IAMGroupNodeData>): Node<IAMGroupNodeData> {
  return _.merge(
    {},
    TEMPLATE_GROUP_NODE,
    { data: props },
    { id: props.id, deletable: props.unnecessary_node }
  );
}
