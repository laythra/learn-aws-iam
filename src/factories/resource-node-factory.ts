import { type HandleProps, Position } from '@xyflow/react';
import _ from 'lodash';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import {
  IAMNodeImage,
  IAMNodeEntity,
  IAMNodeResourceEntity,
  HandleID,
  IAMResourceNode,
} from '@/types';

const TEMPLATE_RESOURCE_NODE: IAMResourceNode = {
  id: 'iam_resource',
  position: { x: 0, y: 0 },
  draggable: true,
  type: 'resource',
  deletable: false,
  data: {
    id: 'iam_group',
    label: 'IAM Resource',
    entity: IAMNodeEntity.Resource,
    handles: [
      { id: HandleID.Top, type: 'source', position: Position.Top },
      { id: HandleID.Right, type: 'source', position: Position.Right },
      { id: HandleID.Bottom, type: 'source', position: Position.Bottom },
      { id: HandleID.Left, type: 'source', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
    associated_roles: [],
    animations: getNodeAnimations(NODE_ANIMATION_ID.ShimmerBackground),
  },
};

export function createResourceNode(props: Partial<IAMResourceNode['data']>): IAMResourceNode {
  return _.merge(
    {},
    TEMPLATE_RESOURCE_NODE,
    { data: props },
    { id: props.id, deletable: props.unnecessary_node }
  );
}
