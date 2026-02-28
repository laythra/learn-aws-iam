import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMResourceNode } from '@/types/iam-node-types';

const TUTORIAL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [];
const IN_LEVEL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.TeamPeachSecret,
    label: 'db/peach-team',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,
    layout_direction: 'horizontal',
    tags: [['application', 'peach-team']],
  },
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
    id: ResourceNodeID.TeamBowserSecret,
    label: 'db/bowser-force',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,
    layout_direction: 'horizontal',
    tags: [['application', 'bowser-force']],
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
