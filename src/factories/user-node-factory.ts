import _ from 'lodash';
import { Position, type HandleProps, type Node } from 'reactflow';

import { type IAMUserNodeData, IAMNodeEntity, IAMNodeImage } from '@/types';

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
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Right, type: 'source', position: Position.Right },
      { id: Position.Left, type: 'source', position: Position.Left },
      { id: Position.Bottom, type: 'target', position: Position.Bottom },
    ] as HandleProps[],
    image: IAMNodeImage.User,
    associated_policies: [],
    initial_position: 'top-center',
    associated_roles: [],
  },
};

export function createUserNode(props: Partial<IAMUserNodeData>): Node<IAMUserNodeData> {
  props.id ||= Date.now().toString();

  return _.merge({}, TEMPLATE_USER_NODE, { data: props }, { id: props.id });
}
