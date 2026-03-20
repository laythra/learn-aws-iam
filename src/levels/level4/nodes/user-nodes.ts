import _ from 'lodash';

import { UserNodeID } from '../types/node-ids';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.Developer1,
    label: 'alex',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: UserNodeID.Developer2,
    label: 'sam',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: UserNodeID.DataScientist1,
    label: 'morgan',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: UserNodeID.Intern1,
    label: 'casey',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
  {
    id: UserNodeID.Intern2,
    label: 'jordan',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
  },
];

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(nodeData =>
  createUserNode({ dataOverrides: nodeData })
);

export const groupedByIdUsers = _.keyBy(INITIAL_IN_LEVEL_USER_NODES, 'id');
