import { HandleProps, Position } from '@xyflow/react';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/domain/nodes/resource-node-factory';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMResourceNode } from '@/types/iam-node-types';

const TUTORIAL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.PublicImagesS3Bucket,
    label: 'public-images',
    layout_group_id: CommonLayoutGroupID.BottomRightVertical,
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
    handles: [{ id: Position.Top, type: 'target', position: Position.Top }] as HandleProps[],
  },
];

export const INITIAL_TUTORIAL_RESOURCE_NODES: IAMResourceNode[] = TUTORIAL_RESOURCE_NODES.map(
  nodeData => createResourceNode({ dataOverrides: nodeData })
);
