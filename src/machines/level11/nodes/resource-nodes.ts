import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import {
  CommonLayoutGroupID,
  IAMNodeImage,
  IAMNodeResourceEntity,
  type IAMResourceNode,
} from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.S3BucketTutorial,
    label: 'planet-healing-archives',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
];

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.LambdaFunction,
    label: 'Lambda Function',
    layout_group_id: CommonLayoutGroupID.BottomLeftVertical,
    image: IAMNodeImage.Lambda,
    resource_type: IAMNodeResourceEntity.Lambda,
  },
  {
    id: ResourceNodeID.S3BucketInLevel,
    label: 'db-backups',
    layout_group_id: CommonLayoutGroupID.BottomLeftVertical,
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: ResourceNodeID.Secret1,
    label: 'prod/db/credentials',
    layout_group_id: CommonLayoutGroupID.BottomLeftVertical,
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,
    tags: [['team', 'avalanche']],
  },
  {
    id: ResourceNodeID.SNSTopic,
    label: 'email-notifications',
    layout_group_id: CommonLayoutGroupID.BottomLeftVertical,
    image: IAMNodeImage.Server,
    resource_type: IAMNodeResourceEntity.Lambda,
  },
  {
    id: ResourceNodeID.Secret2,
    label: 'prod/ssl-certs',
    layout_group_id: CommonLayoutGroupID.BottomLeftVertical,
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,
    tags: [['team', 'avalanche']],
  },
];

export const INITIAL_TUTORIAL_RESOURCE_NODES: IAMResourceNode[] = TUTORIAL_RESOURCE_NODES.map(
  nodeData =>
    createResourceNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: true },
    })
);

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData =>
    createResourceNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: false },
    })
);
