import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import type { IAMUserNode } from '@/types';
import { CommonLayoutGroupID, IAMNodeImage } from '@/types';

const TUTORIAL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.TutorialUser,
    label: 'Laith',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    image: IAMNodeImage.User,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(nodeData =>
  createUserNode({
    dataOverrides: nodeData,
  })
);
