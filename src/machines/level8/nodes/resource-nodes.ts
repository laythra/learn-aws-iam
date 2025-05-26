import _ from 'lodash';

import { AccountNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import { IAMNodeImage, IAMNodeResourceEntity, type IAMResourceNode } from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = _.zip(
  [ResourceNodeID.TutorialSecret1, ResourceNodeID.TutorialSecret2, ResourceNodeID.TutorialSecret3],
  ['github-webhook-token', 'salesforce-integration-token', 'slack-notification-token']
).map(([id, label]) => ({
  id,
  label,
  initial_position: 'bottom-right',
  image: IAMNodeImage.Secret,
  resource_type: IAMNodeResourceEntity.Secret,
  layout_direction: 'horizontal',
  horizontal_spacing: 80,
  parent_id: AccountNodeID.Dev,
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
      rootOverrides: { parentId: AccountNodeID.Dev, draggable: true },
    })
);

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData =>
    createResourceNode({
      dataOverrides: nodeData,
      rootOverrides: { parentId: AccountNodeID.Prod, draggable: true },
    })
);
