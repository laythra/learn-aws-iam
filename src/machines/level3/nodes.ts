import { Node } from 'reactflow';

import { INITIAL_IN_LEVEL_GROUP_NODES } from './nodes/group-nodes';
import { INITIAL_TUTORIAL_POLICY_NODES } from './nodes/policy-nodes';
import { INITIAL_IN_LEVEL_RESOURCE_NODES } from './nodes/resource-nodes';
import { INITIAL_IN_LEVEL_USER_NODES } from './nodes/user-nodes';
import { IAMAnyNodeData } from '@/types';

export const INITIAL_TUTORIAL_NODES: Node<IAMAnyNodeData>[] = INITIAL_TUTORIAL_POLICY_NODES;
export const INITIAL_IN_LEVEL_NODES: Node<IAMAnyNodeData>[] = [
  ...INITIAL_IN_LEVEL_GROUP_NODES,
  ...INITIAL_IN_LEVEL_RESOURCE_NODES,
  ...INITIAL_IN_LEVEL_USER_NODES,
];
