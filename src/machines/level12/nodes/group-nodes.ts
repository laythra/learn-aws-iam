import { AccountID, GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { CommonLayoutGroupID, IAMGroupNode } from '@/types';

const TUTORIAL_GROUP_NODES: Partial<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.TutorialEldianGroup,
    label: 'Eldians',
    layout_group_id: CommonLayoutGroupID.TopRightHorizontal,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
  },
  {
    id: GroupNodeID.TutorialMarleyGroup,
    label: 'Marliyans',
    layout_group_id: CommonLayoutGroupID.TopRightHorizontal,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
  },
];

const IN_LEVEL_GROUP_NODES: Partial<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.InLevelNotificationsTeamGroup,
    label: 'Notifications Team',
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
  },
  {
    id: GroupNodeID.InLevelSearchTeamGroup,
    label: 'Search Team',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
  },
  {
    id: GroupNodeID.InLevelPaymentsTeamGroup,
    label: 'Payments Team',
    layout_group_id: CommonLayoutGroupID.RightCenterHorizontal,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
  },
];

export const INITIAL_TUTORIAL_GROUP_NODES: IAMGroupNode[] = TUTORIAL_GROUP_NODES.map(nodeData =>
  createGroupNode({
    dataOverrides: nodeData,
    rootOverrides: { draggable: false, parentId: nodeData.parent_id, extent: 'parent' },
  })
);

export const INITIAL_IN_LEVEL_GROUP_NODES: IAMGroupNode[] = IN_LEVEL_GROUP_NODES.map(nodeData =>
  createGroupNode({
    dataOverrides: nodeData,
    rootOverrides: { draggable: true, parentId: nodeData.parent_id, extent: 'parent' },
  })
);
