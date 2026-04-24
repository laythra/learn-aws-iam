import { ResourceNodeID } from '../types/node-ids';
import { createResourceNode } from '@/domain/nodes/resource-node-factory';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMResourceNode } from '@/types/iam-node-types';

const TUTORIAL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [];
const IN_LEVEL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.TeamAlphaSecret,
    label: 'db/alpha-team',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,

    tags: [['application', 'alpha-team']],
  },
  {
    id: ResourceNodeID.RDS1,
    label: 'alpha-team-rds',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.RDS,

    tags: [['application', 'alpha-team']],
  },

  {
    id: ResourceNodeID.TeamBetaSecret,
    label: 'db/beta-team',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,

    tags: [['application', 'beta-team']],
  },
  {
    id: ResourceNodeID.RDS2,
    label: 'beta-team-rds',
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.RDS,

    tags: [['application', 'beta-team']],
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
