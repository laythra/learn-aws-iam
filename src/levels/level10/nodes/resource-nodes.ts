import _ from 'lodash';

import { ResourceNodeID } from '../types/node-ids';
import { createResourceNode } from '@/domain/nodes/resource-node-factory';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMResourceNode } from '@/types/iam-node-types';

const TUTORIAL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = [];
const IN_LEVEL_RESOURCE_NODES: IAMNodeDataOverrides<IAMResourceNode['data']>[] = _.zip(
  [ResourceNodeID.EC2Instance1, ResourceNodeID.EC2Instance2, ResourceNodeID.EC2Instance3],
  [
    ['application', 'payments-team'],
    ['application', 'compliance-team'],
    ['application', 'analytics-team'],
  ],
  ['payments-ec2', 'compliance-ec2', 'analytics-ec2']
).map(([id, tags, label]) => ({
  id,
  label,
  layout_group_id: CommonLayoutGroupID.RightCenterVertical,
  image: IAMNodeImage.Server,
  resource_type: IAMNodeResourceEntity.EC2Instance,
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
