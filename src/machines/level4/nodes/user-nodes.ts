import _ from 'lodash';
import { type Node } from 'reactflow';

import { userToPolicyAssocations } from './initial-associations';
import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import { attachPoliciesToUsers } from '@/machines/utils/association-manager';
import type { IAMUserNodeData } from '@/types';

const IN_LEVEL_USER_NODES: Partial<IAMUserNodeData>[] = [
  {
    id: UserNodeID.Developer1,
    label: 'Omar',
    initial_position: 'center',
  },
  {
    id: UserNodeID.Developer2,
    label: 'Sara',
    initial_position: 'center',
  },
  {
    id: UserNodeID.DataScientist1,
    label: 'Ahmad',
    initial_position: 'center',
  },
  {
    id: UserNodeID.Intern1,
    label: 'Layla',
    initial_position: 'center',
  },
  {
    id: UserNodeID.Intern2,
    label: 'Mohammad',
    initial_position: 'center',
  },
];

// TODO: Get rid of defining association in this way, and define them manually in the above array instead
export const INITIAL_IN_LEVEL_USER_NODES: Node<IAMUserNodeData>[] = attachPoliciesToUsers(
  IN_LEVEL_USER_NODES.map(createUserNode),
  userToPolicyAssocations
);

export const groupedByIdUsers = _.keyBy(INITIAL_IN_LEVEL_USER_NODES, 'id');
