import { Node } from 'reactflow';

import { INITIAL_TUTORIAL_POLICY_NODES } from './policy-nodes';
import { INITIAL_IN_LEVEL_POLICY_NODES } from './policy-nodes';
import { INITIAL_TUTORIAL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_IN_LEVEL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_TUTORIAL_ROLE_NODES } from './role-nodes';
import { INITIAL_TUTORIAL_USER_NODES } from './user-nodes';
import { IAMAnyNodeData } from '@/types';

export const INITIAL_TUTORIAL_NODES: Node<IAMAnyNodeData>[] = [
  ...INITIAL_TUTORIAL_ROLE_NODES,
  ...INITIAL_TUTORIAL_USER_NODES,
  ...INITIAL_TUTORIAL_RESOURCE_NODES,
  ...INITIAL_TUTORIAL_POLICY_NODES,
];
export const INITIAL_IN_LEVEL_NODES: Node<IAMAnyNodeData>[] = [
  ...INITIAL_IN_LEVEL_RESOURCE_NODES,
  ...INITIAL_IN_LEVEL_POLICY_NODES,
];
