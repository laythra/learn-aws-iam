import keyBy from 'lodash/keyBy';

import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
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

export const groupedByIdUsers = keyBy(INITIAL_IN_LEVEL_USER_NODES, 'id');
