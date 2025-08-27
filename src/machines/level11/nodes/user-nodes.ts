import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID, IAMUserNode } from '@/types';

const TUTORIAL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Sephiroth,
    label: 'Sephiroth',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { draggable: false },
  })
);
