import { AccountID, GroupNodeID } from '../types/node-id-enums';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { CommonLayoutGroupID, IAMGroupNode } from '@/types';

const TUTORIAL_GROUP_NODES: Partial<IAMGroupNode['data']>[] = [
  {
    id: GroupNodeID.TutorialEldianGroup,
    label: 'Marliyans',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    parent_id: AccountID.TutorialProdAccount,
    account_id: AccountID.TutorialProdAccount,
  },
  {
    id: GroupNodeID.TutorialMarleyGroup,
    label: 'Marliyans',
    layout_group_id: CommonLayoutGroupID.RightCenterVertical,
    parent_id: AccountID.TutorialStagingAccount,
    account_id: AccountID.TutorialStagingAccount,
  },
];

export const INITIAL_TUTORIAL_GROUP_NODES: IAMGroupNode[] = TUTORIAL_GROUP_NODES.map(nodeData =>
  createGroupNode({
    dataOverrides: nodeData,
    rootOverrides: { draggable: false, parentId: nodeData.parent_id, extent: 'parent' },
  })
);
