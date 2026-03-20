import { LayoutGroupID } from '../layout-groups';
import { AccountID, OUNodeID, UserNodeID } from '../types/node-ids';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const TUTORIAL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.TutorialAlex,
    label: 'alex',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
    ou_id: OUNodeID.TutorialOU,
  },
  {
    id: UserNodeID.TutorialSam,
    label: 'sam',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
    ou_id: OUNodeID.TutorialOU,
  },
  {
    id: UserNodeID.TutorialMorgan,
    label: 'morgan',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
    ou_id: OUNodeID.TutorialOU,
  },
  {
    id: UserNodeID.TutorialJordan,
    label: 'jordan',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
    ou_id: OUNodeID.TutorialOU,
  },
  {
    id: UserNodeID.TutorialCasey,
    label: 'casey',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
    ou_id: OUNodeID.TutorialOU,
  },
  {
    id: UserNodeID.TutorialTaylor,
    label: 'taylor',
    layout_group_id: CommonLayoutGroupID.CenterVertical,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
    ou_id: OUNodeID.TutorialOU,
  },
];

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Alex,
    label: 'alex',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
    tags: [['team', 'devops']],
  },
  {
    id: UserNodeID.Sam,
    label: 'sam',
    layout_group_id: LayoutGroupID.InLevelUsersLayoutGroup,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
    tags: [['team', 'frontend']],
  },
  {
    id: UserNodeID.Morgan,
    label: 'morgan',
    layout_group_id: LayoutGroupID.InLevelUsersLayoutGroup,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
    tags: [['team', 'backend']],
  },
  {
    id: UserNodeID.Jordan,
    label: 'jordan',
    layout_group_id: LayoutGroupID.InLevelUsersLayoutGroup,
    parent_id: AccountID.InLevelStagingAccount,
    account_id: AccountID.InLevelStagingAccount,
    tags: [['team', 'backend']],
  },
  ...[UserNodeID.Casey, UserNodeID.Taylor].map(id => ({
    id,
    label: id === UserNodeID.Casey ? 'casey' : 'taylor',
    layout_group_id: LayoutGroupID.InLevelPaymentsSquadLayoutGroup,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
    tags: [['squad', 'payments']] as [string, string][],
  })),
  ...[UserNodeID.Riley, UserNodeID.Robin].map(id => ({
    id,
    label: id === UserNodeID.Riley ? 'riley' : 'robin',
    layout_group_id: LayoutGroupID.InLevelNotificationsSquadLayoutGroup,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
    tags: [['squad', 'notifications']] as [string, string][],
  })),
  ...[UserNodeID.Quinn, UserNodeID.Blake].map(id => ({
    id,
    label: id === UserNodeID.Quinn ? 'quinn' : 'blake',
    layout_group_id: LayoutGroupID.InLevelSearchSquadLayoutGroup,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
    tags: [['squad', 'search']] as [string, string][],
  })),
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { parentId: node.parent_id },
  })
);

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { parentId: node.parent_id },
  })
);
