import { OUNodeID } from '../types/node-id-enums';
import { createOUNode } from '@/factories/nodes/ou-node-factory';
import { AccountID } from '@/machines/types';
import type { IAMOUNode } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_OU_NODES: Partial<IAMOUNode['data']>[] = [
  {
    id: OUNodeID.Dev,
    label: 'Org Unit',
    initial_position: 'top-center',
    image: IAMNodeImage.OU,
    account_id: AccountID.Trusting,
  },
];

const IN_LEVEL_OU_NODES: Partial<IAMOUNode['data']>[] = [
  {
    id: OUNodeID.Dev,
    label: 'Org Unit',
    initial_position: 'top-center',
    image: IAMNodeImage.OU,
  },
];

export const INITIAL_TUTORIAL_OU_NODES: IAMOUNode[] = TUTORIAL_OU_NODES.map(nodeData =>
  createOUNode({
    dataOverrides: nodeData,
  })
);

export const INITIAL_IN_LEVEL_OU_NODES: IAMOUNode[] = IN_LEVEL_OU_NODES.map(nodeData =>
  createOUNode({
    dataOverrides: nodeData,
  })
);
