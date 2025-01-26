import _, { get } from 'lodash';
import { type Node, type HandleProps, Position } from 'reactflow';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import {
  IAMResourceNodeData,
  IAMNodeImage,
  IAMNodeEntity,
  IAMNodeResourceEntity,
  HandleID,
} from '@/types';

const TEMPLATE_RESOURCE_NODE: Node<IAMResourceNodeData> = {
  id: 'iam_resources',
  position: { x: 0, y: 0 },
  type: 'iam_default',
  draggable: true,
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

export function createResourceNode(props: Partial<IAMResourceNodeData>): Node<IAMResourceNodeData> {
  return _.merge({}, TEMPLATE_RESOURCE_NODE, { data: props }, { id: props.id });
}
