import { AccountID } from '../types/node-ids';
import { createAccountNode } from '@/domain/nodes/account-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMAccountNode } from '@/types/iam-node-types';

const TUTORIAL_ACCOUNT_NODES: IAMNodeDataOverrides<IAMAccountNode['data']>[] = [];

const IN_LEVEL_ACCOUNT_NODES: IAMNodeDataOverrides<IAMAccountNode['data']>[] = [
  {
    id: AccountID.TrustingAccount,
    label: 'Trusting Account',
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
  },
  {
    id: AccountID.TrustedAccount,
    label: 'Trusted Account',
    layout_group_id: CommonLayoutGroupID.RightCenterHorizontal,
  },
];

export const INITIAL_TUTORIAL_ACCOUNT_NODES: IAMAccountNode[] = TUTORIAL_ACCOUNT_NODES.map(
  nodeData =>
    createAccountNode({ dataOverrides: nodeData, rootOverrides: { draggable: false, height: 400 } })
);

export const INITIAL_IN_LEVEL_ACCOUNT_NODES: IAMAccountNode[] = IN_LEVEL_ACCOUNT_NODES.map(
  nodeData =>
    createAccountNode({
      dataOverrides: nodeData,
      rootOverrides: { draggable: false, height: 400, width: window.innerWidth * 0.5 },
    })
);
