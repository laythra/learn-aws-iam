import _ from 'lodash';
import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import { IAMPolicyNodeData, IAMNodeImage, IAMNodeEntity, HandleID } from '@/types';

export const TEMPLATE_POLICY_NODE: Node<IAMPolicyNodeData> = {
  id: 'iam_policy',
  position: { x: 0, y: 0 },
  type: 'iam_default',
  draggable: true,
  deletable: false,
  data: {
    id: 'iam_policy',
    label: 'IAM Policy',
    entity: IAMNodeEntity.Policy,
    handles: [
      { id: HandleID.Top, type: 'source', position: Position.Top },
      { id: HandleID.Right, type: 'source', position: Position.Right },
      { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
      { id: HandleID.Left, type: 'source', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.Policy,
    initial_position: 'center',
    editable: true,
    granted_accesses: [],
    content: '',
    animations: getNodeAnimations(NODE_ANIMATION_ID.ShimmerBackground),
    initial_edges: [],
  },
};

export function createPolicyNode(props: Partial<IAMPolicyNodeData>): Node<IAMPolicyNodeData> {
  return _.merge(
    {},
    TEMPLATE_POLICY_NODE,
    { data: props },
    { id: props.id, deletable: props.unnecessary_node }
  );
}
