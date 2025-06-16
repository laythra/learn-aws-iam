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
    id: ResourceNodeID.RDS1,
    label: 'peach-team-rds',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.RDS,
    layout_direction: 'horizontal',
    tags: [['application', 'peach-team']],
  },
  {
    id: ResourceNodeID.RDS2,
    label: 'bowser-force-rds',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.RDS,
    layout_direction: 'horizontal',
    tags: [['application', 'bowser-force']],
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
