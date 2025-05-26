import { AccountNodeID } from '../types/node-id-enums';
import { createAccountNode } from '@/factories/nodes/account-node-factory';
import { AccountID } from '@/machines/types';
import type { IAMAccountNode } from '@/types';

const TUTORIAL_ACCOUNT_NODES: Partial<IAMAccountNode['data']>[] = [
  {
    id: AccountNodeID.Dev,
    label: 'Development Account',
    initial_position: 'bottom-center',
    account_id: AccountID.Trusting,
  },
];

const IN_LEVEL_ACCOUNT_NODES: Partial<IAMAccountNode['data']>[] = [
  {
    id: AccountNodeID.Staging,
    label: 'Staging Account',
    initial_position: 'left-center',
  },
  {
    id: AccountNodeID.Prod,
    label: 'Production Account',
    initial_position: 'right-center',
  },
];

export const INITIAL_TUTORIAL_ACCOUNT_NODES: IAMAccountNode[] = TUTORIAL_ACCOUNT_NODES.map(
  nodeData => createAccountNode({ dataOverrides: nodeData, rootOverrides: { draggable: false } })
);

export const INITIAL_IN_LEVEL_ACCOUNT_NODES: IAMAccountNode[] = IN_LEVEL_ACCOUNT_NODES.map(
  nodeData =>
    createAccountNode({ dataOverrides: nodeData, rootOverrides: { draggable: false, width: 600 } })
);
