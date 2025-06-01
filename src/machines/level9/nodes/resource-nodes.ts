import _ from 'lodash';

import { AccountNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import { IAMNodeImage, IAMNodeResourceEntity, type IAMResourceNode } from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = _.zip(
  [
    ResourceNodeID.TutorialEC2Instance1,
    ResourceNodeID.TutorialEC2Instance2,
    ResourceNodeID.TutorialEC2Instance3,
    ResourceNodeID.TutorialEC2Instance4,
  ],
  ['ec2-instance-1', 'ec2-instance-2', 'ec2-instance-3', 'ec2-instance-4'],
  ['james', 'bond', 'james', 'bond']
).map(([id, label, creator]) => ({
  id,
  label,
  initial_position: 'center',
  image: IAMNodeImage.Server,
  resource_type: IAMNodeResourceEntity.EC2Instance,
  layout_direction: 'horizontal',
  tags: [['CreatedBy', creator!]],
}));

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.InLevelSecret1,
    label: 'slack-alert-token',
    initial_position: 'left-center',
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,
    layout_direction: 'horizontal',
    horizontal_spacing: 10,
    parent_id: AccountNodeID.Prod,
  },
  {
    id: ResourceNodeID.InLevelSecret1,
    label: 'slack-alert-token',
    initial_position: 'left-center',
    image: IAMNodeImage.Secret,
    resource_type: IAMNodeResourceEntity.Secret,
    layout_direction: 'horizontal',
    horizontal_spacing: 10,
    parent_id: AccountNodeID.Prod,
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
      rootOverrides: { parentId: AccountNodeID.Prod, draggable: true },
    })
);
