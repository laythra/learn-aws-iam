import _ from 'lodash';

import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID, type IAMUserNode } from '@/types';

const IN_LEVEL_USER_NODES: Partial<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Developer1,
    label: 'Omar',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: UserNodeID.Developer2,
    label: 'Sara',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: UserNodeID.DataScientist1,
    label: 'Ahmad',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: UserNodeID.Intern1,
    label: 'Layla',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: UserNodeID.Intern2,
    label: 'Mohammad',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);

export const groupedByIdUsers = _.keyBy(INITIAL_IN_LEVEL_USER_NODES, 'id');
