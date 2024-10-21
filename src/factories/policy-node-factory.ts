import _ from 'lodash';
import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { IAMPolicyNodeData, IAMNodeImage, IAMNodeEntity } from '@/types';

export const TEMPLATE_POLICY_NODE: Node<IAMPolicyNodeData> = {
  id: 'iam_policy',
  position: { x: 0, y: 0 },
  type: 'iam_default',
  draggable: true,
  data: {
    id: 'iam_policy',
    label: 'IAM Policy',
    entity: IAMNodeEntity.Policy,
    handles: [
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Right, type: 'source', position: Position.Right },
      { id: Position.Bottom, type: 'source', position: Position.Bottom },
      { id: Position.Left, type: 'source', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.Policy,
    initial_position: 'center',
  } as IAMPolicyNodeData,
};

export function createPolicyNode(props: Partial<IAMPolicyNodeData>): Node<IAMPolicyNodeData> {
  return _.merge({}, TEMPLATE_POLICY_NODE, { data: props }, { id: props.id });
}
