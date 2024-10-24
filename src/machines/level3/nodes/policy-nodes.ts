import _ from 'lodash';
import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { MANAGED_POLICIES } from '@/machines/config';
import { IAMPolicyNodeData, IAMNodeImage, IAMNodeEntity } from '@/types';

// export const X_OFFSET = theme.sizes.iamNodeWidthInPixels;
export const X_OFFSET = 350;
export const Y_OFFSET = 450;

export enum PolicyNodeID {
  S3ReadAccess = 'S3_read_access',
  S3ReadWriteAcces = 'S3_read_write_access',
  DynamoDBReadWriteAccess = 'DynamoDB_read_write_access',
  CloudfrontReadAccess = 'Cloudfront_read_access',
}

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
    description: '',
    initial_position: 'bottom-center',
  } as IAMPolicyNodeData,
};

const TUTORIAL_POLICY_NODES: Partial<IAMPolicyNodeData>[] = [
  {
    id: PolicyNodeID.S3ReadAccess,
    label: 's3-read-access',
    content: JSON.stringify(MANAGED_POLICIES.AWSS3ReadOnlyAccess, null, 2),
    initial_position: 'center',
  },
];

export const INITIAL_TUTORIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] = TUTORIAL_POLICY_NODES.map(
  ({ id, label, content, initial_position }) =>
    _.merge({}, TEMPLATE_POLICY_NODE, {
      id,
      data: {
        id,
        content,
        label,
        initial_position,
      },
    })
);

export const INITIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] = INITIAL_TUTORIAL_POLICY_NODES;
