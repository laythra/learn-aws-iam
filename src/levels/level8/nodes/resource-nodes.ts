import { ResourceNodeID } from '../types/node-ids';
import { createResourceNode } from '@/domain/nodes/resource-node-factory';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMResourceNode } from '@/types/iam-node-types';

const TUTORIAL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [];
const IN_LEVEL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.SlackIntegrationSecret,
    label: 'slack-alert-token',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,
  },
  {
    id: ResourceNodeID.SlackCrashlyticsNotifierService,
    label: 'slack-alerting-service',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Server,
    resource_type: IAMNodeResourceEntity.EC2Instance,
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
      rootOverrides: { draggable: true },
    })
);
