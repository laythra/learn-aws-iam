import _ from 'lodash';
import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { MANAGED_POLICIES } from '@/machines/config';
import { IAMPolicyNodeData, IAMNodeImage, IAMNodeEntity, IAMMinPolicyNodeData } from '@/types';

// export const X_OFFSET = theme.sizes.iamNodeWidthInPixels;
export const X_OFFSET = 350;
export const Y_OFFSET = 450;

export const TEMPLATE_POLICY_NODE: Node<IAMPolicyNodeData> = {
  id: 'iam_policy',
  position: { x: X_OFFSET, y: Y_OFFSET },
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
    resources_affected: [],
    description: '',
    initial_position: 'bottom-center',
  } as IAMPolicyNodeData,
};

const TUTORIAL_POLICY_NODES: IAMMinPolicyNodeData[] = [
  {
    id: 'iam_policy_1',
    label: 's3-read-access',
    code: JSON.stringify(MANAGED_POLICIES.AWSS3ReadOnlyAccess, null, 2),
    resources_affected: [],
    initial_position: 'center',
    position: { x: 100, y: 100 },
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] = TUTORIAL_POLICY_NODES.map(
  ({ id, label, code, initial_position }) =>
    _.merge({}, TEMPLATE_POLICY_NODE, {
      id,
      data: {
        id,
        code,
        label,
        initial_position,
      },
    })
);

export const INITIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] = INITIAL_TUTORIAL_POLICY_NODES;
