import _ from 'lodash';
import { type Node, type HandleProps, Position } from 'reactflow';

import { IAMResourceNodeData, IAMNodeImage, IAMNodeEntity, IAMNodeResourceEntity } from '@/types';

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
      { id: Position.Top, type: 'source', position: Position.Top },
      { id: Position.Right, type: 'target', position: Position.Right },
      { id: Position.Bottom, type: 'target', position: Position.Bottom },
      { id: Position.Left, type: 'target', position: Position.Left },
    ] as HandleProps[],
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
};

export function createResourceNode(props: Partial<IAMResourceNodeData>): Node<IAMResourceNodeData> {
  return _.merge({}, TEMPLATE_RESOURCE_NODE, { data: props }, { id: props.id });
}
