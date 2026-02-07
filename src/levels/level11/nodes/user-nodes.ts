import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const TUTORIAL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Sephiroth,
    label: 'Sephiroth',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
];

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Cloud,
    label: 'Cloud',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [
      ['level', 'senior'],
      ['team', 'avalanche'],
    ],
  },
  {
    id: UserNodeID.Tifa,
    label: 'Tifa',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [
      ['level', 'junior'],
      ['team', 'avalanche'],
    ],
  },
  {
    id: UserNodeID.Rufus,
    label: 'Rufus',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [
      ['level', 'junior'],
      ['team', 'shinra'],
    ],
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { draggable: false },
  })
);

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { draggable: false },
  })
);
