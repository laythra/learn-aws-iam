import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { type IAMUserNode } from '@/types';

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Mario,
    label: 'mario',
    initial_position: 'left-center',
    layout_direction: 'vertical',
    tags: [['application', 'peach-team']],
  },
  {
    id: UserNodeID.Luigi,
    label: 'luigi',
    initial_position: 'left-center',
    layout_direction: 'vertical',
    tags: [['application', 'peach-team']],
  },
  {
    id: UserNodeID.Peach,
    label: 'peach',
    initial_position: 'left-center',
    layout_direction: 'vertical',
    tags: [['application', 'mashroom-team']],
  },
  {
    id: UserNodeID.Bowser,
    label: 'bowser',
    initial_position: 'right-center',
    layout_direction: 'vertical',
    tags: [['application', 'bowser-force']],
  },
  {
    id: UserNodeID.Wario,
    label: 'wario',
    initial_position: 'right-center',
    layout_direction: 'vertical',
    tags: [['application', 'bowser-force']],
  },
  {
    id: UserNodeID.Waluigi,
    label: 'waluigi',
    initial_position: 'right-center',
    layout_direction: 'vertical',
    tags: [['application', 'bowser-force']],
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { extent: 'parent', parentId: node.parent_id },
  })
);
