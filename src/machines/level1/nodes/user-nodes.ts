import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/machines/consts';
import type { IAMUserNode } from '@/types';
import { IAMNodeImage } from '@/types';

const TUTORIAL_POLICY_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.TutorialUser,
    label: 'Laith',
    layout_group_id: CommonLayoutGroupID.Center,
    image: IAMNodeImage.User,
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_POLICY_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);
