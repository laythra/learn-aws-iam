import { UserNodeID } from '../types/node-ids';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const TUTORIAL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Alex,
    label: 'alex',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
];

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Sam,
    label: 'sam',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [
      ['level', 'senior'],
      ['team', 'alpha-team'],
    ],
  },
  {
    id: UserNodeID.Morgan,
    label: 'morgan',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [
      ['level', 'junior'],
      ['team', 'alpha-team'],
    ],
  },
  {
    id: UserNodeID.Jordan,
    label: 'jordan',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    tags: [
      ['level', 'junior'],
      ['team', 'beta-team'],
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
