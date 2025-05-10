import { AccountNodeID, UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { type IAMUserNode } from '@/types';

const TUTORIAL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.TutorialFirstUser,
    label: 'laith',
    initial_position: 'top-center',
    parent_id: AccountNodeID.Dev,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(nodeData =>
  createUserNode({
    dataOverrides: nodeData,
    rootOverrides: { extent: 'parent', parentId: AccountNodeID.Dev, draggable: false },
  })
);

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = [];
