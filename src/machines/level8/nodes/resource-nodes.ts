import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import {
  CommonLayoutGroupID,
  IAMNodeImage,
  IAMNodeResourceEntity,
  type IAMResourceNode,
} from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [];
const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.SlackIntegrationSecret,
    label: 'slack-alert-token',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,
    layout_direction: 'vertical',
  },
  {
    id: ResourceNodeID.SlackCrashlyticsNotifierService,
    label: 'slack-alerting-service',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    image: IAMNodeImage.Server,
    resource_type: IAMNodeResourceEntity.EC2Instance,
    layout_direction: 'vertical',
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
