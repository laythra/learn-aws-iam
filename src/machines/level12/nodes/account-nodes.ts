import { AccountID } from '../types/node-id-enums';
import { createAccountNode } from '@/factories/nodes/account-node-factory';
import { CommonLayoutGroupID, type IAMAccountNode } from '@/types';

const TUTORIAL_ACCOUNT_NODES: Partial<IAMAccountNode['data']>[] = [
  {
    id: AccountID.TutorialStagingAccount,
    label: 'Staging Account',
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
  },
  {
    id: AccountID.TutorialProdAccount,
    label: 'Production Account',
    layout_group_id: CommonLayoutGroupID.RightCenterHorizontal,
  },
];

const IN_LEVEL_ACCOUNT_NODES: Partial<IAMAccountNode['data']>[] = [
  {
    id: AccountID.InLevelStagingAccount,
    label: 'Staging Account',
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
  },
  {
    id: AccountID.InLevelProdAccount,
    label: 'Production Account',
    layout_group_id: CommonLayoutGroupID.RightCenterHorizontal,
  },
];

export const INITIAL_TUTORIAL_ACCOUNT_NODES: IAMAccountNode[] = TUTORIAL_ACCOUNT_NODES.map(
  nodeData =>
    createAccountNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: false, height: 400 },
    })
);

export const INITIAL_IN_LEVEL_ACCOUNT_NODES: IAMAccountNode[] = IN_LEVEL_ACCOUNT_NODES.map(
  nodeData =>
    createAccountNode({
      dataOverrides: nodeData,
      rootOverrides: {
        draggable: true,
        height: window.innerHeight * 0.7,
        width: window.innerWidth * 0.5,
      },
    })
);
