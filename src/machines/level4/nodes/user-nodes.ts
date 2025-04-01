import _ from 'lodash';

import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/user-node-factory';
import type { IAMUserNode } from '@/types';

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
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

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(createUserNode);

export const groupedByIdUsers = _.keyBy(INITIAL_IN_LEVEL_USER_NODES, 'id');
