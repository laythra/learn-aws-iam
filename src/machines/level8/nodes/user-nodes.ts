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

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.SeniorWayne,
    label: 'senior-wayne',
    initial_position: 'bottom-right',
    horizontal_spacing: 80,
    parent_id: AccountNodeID.Prod,
  },
  {
    id: UserNodeID.JuniorBruce,
    label: 'junior-bruce',
    initial_position: 'bottom-right',
    horizontal_spacing: 80,
    parent_id: AccountNodeID.Prod,
  },
  {
    id: UserNodeID.JuniorClark,
    label: 'junior-clark',
    initial_position: 'top-right',
    layout_direction: 'vertical',
    parent_id: AccountNodeID.Staging,
  },
  {
    id: UserNodeID.SeniorKent,
    label: 'senior-kent',
    initial_position: 'top-right',
    parent_id: AccountNodeID.Staging,
    layout_direction: 'vertical',
  },
  {
    id: UserNodeID.JuniorDiana,
    label: 'junior-diana',
    initial_position: 'top-right',
    parent_id: AccountNodeID.Staging,
    layout_direction: 'vertical',
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { extent: 'parent', parentId: node.parent_id, draggable: false },
  })
);

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { extent: 'parent', parentId: node.parent_id },
  })
);
