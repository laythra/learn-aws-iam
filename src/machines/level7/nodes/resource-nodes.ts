import { AccountID, ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import type { IAMResourceNode } from '@/types';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.TutorialS3Bucket,
    label: 'public-images',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
];

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.InsideLevelS3Bucket,
    label: 'public-images',
    layout_group_id: CommonLayoutGroupID.LeftCenterVertical,
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
    account_id: AccountID.TrustingAccount,
    parent_id: AccountID.TrustingAccount,
  },
];

export const INITIAL_TUTORIAL_RESOURCE_NODES: IAMResourceNode[] = TUTORIAL_RESOURCE_NODES.map(
  nodeData => createResourceNode({ dataOverrides: nodeData })
);

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData => createResourceNode({ dataOverrides: nodeData })
);
