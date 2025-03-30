import { Node } from 'reactflow';

import { INITIAL_IN_LEVEL_GROUP_NODES } from './group-nodes';
import { INITIAL_IN_LEVEL_POLICY_NODES } from './policy-nodes';
import { INITIAL_IN_LEVEL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_IN_LEVEL_USER_NODES } from './user-nodes';
import { IAMAnyNodeData } from '@/types';

// Level 4 shares the same ndoes for the tutorial and the in level states
export const INITIAL_TUTORIAL_NODES: Node<IAMAnyNodeData>[] = [
  ...INITIAL_IN_LEVEL_POLICY_NODES,
  ...INITIAL_IN_LEVEL_GROUP_NODES,
  ...INITIAL_IN_LEVEL_RESOURCE_NODES,
  ...INITIAL_IN_LEVEL_USER_NODES,
];

export const INITIAL_IN_LEVEL_NODES: Node<IAMAnyNodeData>[] = INITIAL_TUTORIAL_NODES;
