import { LayoutGroupID } from '../layout-groups';
import { AccountID, GroupNodeID } from '../types/node-ids';
import { createGroupNode } from '@/domain/nodes/group-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMGroupNode } from '@/types/iam-node-types';

const TUTORIAL_GROUP_NODES: IAMNodeDataOverrides<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.TutorialProdTeamGroup,
    label: 'Prod Team',
    layout_group_id: CommonLayoutGroupID.TopRightHorizontal,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
  },
  {
    id: GroupNodeID.TutorialStagingTeamGroup,
    label: 'Staging Team',
    layout_group_id: CommonLayoutGroupID.TopRightHorizontal,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
  },
];

const IN_LEVEL_GROUP_NODES: IAMNodeDataOverrides<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.InLevelNotificationsTeamGroup,
    label: 'Notifications Team',
    layout_group_id: LayoutGroupID.InLevelGroupNodesLayoutGroup,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
  },
  {
    id: GroupNodeID.InLevelSearchTeamGroup,
    label: 'Search Team',
    layout_group_id: LayoutGroupID.InLevelGroupNodesLayoutGroup,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
  },
  {
    id: GroupNodeID.InLevelPaymentsTeamGroup,
    label: 'Payments Team',
    layout_group_id: LayoutGroupID.InLevelGroupNodesLayoutGroup,
    parent_id: AccountID.InLevelProdAccount,
    account_id: AccountID.InLevelProdAccount,
  },
];

export const INITIAL_TUTORIAL_GROUP_NODES: IAMGroupNode[] = TUTORIAL_GROUP_NODES.map(nodeData =>
  createGroupNode({
    dataOverrides: nodeData,
    rootOverrides: { draggable: true, parentId: nodeData.parent_id },
  })
);

export const INITIAL_IN_LEVEL_GROUP_NODES: IAMGroupNode[] = IN_LEVEL_GROUP_NODES.map(nodeData =>
  createGroupNode({
    dataOverrides: nodeData,
    rootOverrides: { draggable: true, parentId: nodeData.parent_id },
  })
);
