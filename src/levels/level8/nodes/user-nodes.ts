import { UserNodeID } from '../types/node-ids';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { theme } from '@/theme';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const TUTORIAL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [];

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.JuniorAlex,
    label: 'junior-alex',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    vertical_spacing: theme.sizes.iamNodeHeightInPixels + 20,
    tags: [['role', 'junior']],
  },
  {
    id: UserNodeID.SeniorSam,
    label: 'senior-sam',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    horizontal_spacing: theme.sizes.iamNodeHeightInPixels + 20,
    tags: [['role', 'senior']],
  },
  {
    id: UserNodeID.JuniorMorgan,
    label: 'junior-morgan',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    vertical_spacing: theme.sizes.iamNodeHeightInPixels + 20,
    tags: [['role', 'junior']],
  },
  {
    id: UserNodeID.SeniorJordan,
    label: 'senior-jordan',
    layout_group_id: CommonLayoutGroupID.CenterHorizontal,
    vertical_spacing: theme.sizes.iamNodeHeightInPixels + 20,
    tags: [['role', 'senior']],
  },
];

export const INITIAL_TUTORIAL_USER_NODES: IAMUserNode[] = TUTORIAL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { parentId: node.parent_id, draggable: false },
  })
);

export const INITIAL_IN_LEVEL_USER_NODES: IAMUserNode[] = IN_LEVEL_USER_NODES.map(node =>
  createUserNode({
    dataOverrides: node,
    rootOverrides: { parentId: node.parent_id },
  })
);
