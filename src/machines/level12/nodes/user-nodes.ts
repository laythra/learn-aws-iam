import { LayoutGroupID } from '../layout-groups';
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

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Laith,
    label: 'Laith',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
    tags: [['team', 'devops']],
  },
  {
    id: UserNodeID.Mohammad,
    label: 'Mohammad',
    layout_group_id: LayoutGroupID.InLevelUsersLayoutGroup,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
    tags: [['team', 'frontend']],
  },
  {
    id: UserNodeID.Ayman,
    label: 'Ayman',
    layout_group_id: LayoutGroupID.InLevelUsersLayoutGroup,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
    tags: [['team', 'backend']],
  },
  {
    id: UserNodeID.Firas,
    label: 'Firas',
    layout_group_id: LayoutGroupID.InLevelUsersLayoutGroup,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
    tags: [['team', 'backend']],
  },
  ...[UserNodeID.Omar, UserNodeID.Rania].map(id => ({
    id,
    label: id === UserNodeID.Omar ? 'Omar' : 'Rania',
    layout_group_id: LayoutGroupID.InLevelPaymentsSquadLayoutGroup,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
    tags: [['squad', 'payments']] as [string, string][],
  })),
  ...[UserNodeID.Yasmin, UserNodeID.Karim].map(id => ({
    id,
    label: id === UserNodeID.Yasmin ? 'Yasmin' : 'Karim',
    layout_group_id: LayoutGroupID.InLevelNotificationsSquadLayoutGroup,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
    tags: [['squad', 'notifications']] as [string, string][],
  })),
  ...[UserNodeID.Tareq, UserNodeID.Salma].map(id => ({
    id,
    label: id === UserNodeID.Tareq ? 'Tareq' : 'Salma',
    layout_group_id: LayoutGroupID.InLevelSearchSquadLayoutGroup,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
    tags: [['squad', 'search']] as [string, string][],
  })),
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { parentId: node.parent_id, extent: 'parent' },
  })
);

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { parentId: node.parent_id, extent: 'parent' },
  })
);
