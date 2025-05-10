import { AccountNodeID } from '../types/node-id-enums';
import { createAccountNode } from '@/factories/nodes/account-node-factory';
import { AccountID } from '@/machines/types';
import type { IAMAccountNode } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_ACCOUNT_NODES: Partial<IAMAccountNode['data']>[] = [
  {
    id: AccountNodeID.Dev,
    label: 'Development Account',
    initial_position: 'bottom-center',
    image: IAMNodeImage.S3Bucket,
    account_id: AccountID.Trusting,
  },
];

export const INITIAL_TUTORIAL_ACCOUNT_NODES: IAMAccountNode[] = TUTORIAL_ACCOUNT_NODES.map(
  nodeData => createAccountNode({ dataOverrides: nodeData, rootOverrides: { draggable: false } })
);

export const INITIAL_IN_LEVEL_ACCOUNT_NODES: IAMAccountNode[] = [];
