import { AccountID, UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID, IAMUserNode } from '@/types';

const TUTORIAL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Eren,
    label: 'Eren',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
  },
  {
    id: UserNodeID.Mikasa,
    label: 'Mikasa',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
  },
  {
    id: UserNodeID.Armin,
    label: 'Armin',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
  },
  {
    id: UserNodeID.Reiner,
    label: 'Reiner',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
  },
  {
    id: UserNodeID.Bertolt,
    label: 'Bertolt',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
  },
  {
    id: UserNodeID.Annie,
    label: 'Annie',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
  },
];

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { draggable: true, parentId: node.parent_id, extent: 'parent' },
  })
);

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { draggable: false },
  })
);
