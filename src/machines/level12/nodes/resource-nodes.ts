import { AccountID, ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import {
  CommonLayoutGroupID,
  IAMNodeImage,
  IAMNodeResourceEntity,
  type IAMResourceNode,
} from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.TutorialCloudTrailProd,
    label: 'access-trail',
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
    image: IAMNodeImage.CloudTrail,
    resource_type: IAMNodeResourceEntity.CloudTrail,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
  },
  {
    id: ResourceNodeID.TutorialCloudTrailStaging,
    label: 'access-trail',
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
    image: IAMNodeImage.CloudTrail,
    resource_type: IAMNodeResourceEntity.CloudTrail,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
  },
];

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [];

export const INITIAL_TUTORIAL_RESOURCE_NODES: IAMResourceNode[] = TUTORIAL_RESOURCE_NODES.map(
  nodeData =>
    createResourceNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: true, extent: 'parent', parentId: nodeData.parent_id },
    })
);

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData =>
    createResourceNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: false, extent: 'parent', parentId: nodeData.parent_id },
    })
);
