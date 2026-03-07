import _ from 'lodash';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/domain/nodes/resource-node-factory';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMResourceNode } from '@/types/iam-node-types';

const TUTORIAL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [];
const IN_LEVEL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = _.zip(
  [ResourceNodeID.RDS1, ResourceNodeID.RDS2, ResourceNodeID.RDS3],
  [
    ['team', 'payments-team'],
    ['team', 'compliance-team'],
    ['team', 'analytics-team'],
  ]
).map(([id, tags]) => ({
  id,
  label: `${id}-rds`,
  layout_group_id: CommonLayoutGroupID.RightCenterVertical,
  image: IAMNodeImage.Database,
  resource_type: IAMNodeResourceEntity.RDS,
  tags: [tags as [string, string]],
}));

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
