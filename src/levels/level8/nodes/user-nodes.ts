import { UserNodeID } from '../types/node-id-enums';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { theme } from '@/theme';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMUserNode } from '@/types/iam-node-types';

const TUTORIAL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [];

const IN_LEVEL_USER_NODES: IAMNodeDataOverrides<IAMUserNode['data']>[] = [
  {
    id: UserNodeID.JuniorBruce,
    label: 'junior-bruce',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    vertical_spacing: theme.sizes.iamNodeHeightInPixels + 20,
    tags: [['role', 'junior']],
  },
  {
    id: UserNodeID.SeniorWayne,
    label: 'senior-wayne',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    horizontal_spacing: theme.sizes.iamNodeHeightInPixels + 20,
    tags: [['role', 'senior']],
  },
  {
    id: UserNodeID.JuniorClark,
    label: 'junior-clark',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
    vertical_spacing: theme.sizes.iamNodeHeightInPixels + 20,
    tags: [['role', 'junior']],
  },
  {
    id: UserNodeID.SeniorKent,
    label: 'senior-kent',
    layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
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
