import { Node } from 'reactflow';

import { INITIAL_GROUP_NODES } from './group-nodes';
import { INITIAL_TUTORIAL_POLICY_NODES } from './policy-nodes';
import { INITIAL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_USER_NODES } from './user-nodes';
import { IAMAnyNodeData } from '@/types';

export const INITIAL_TUTORIAL_NODES: Node<IAMAnyNodeData>[] = [
  ...INITIAL_TUTORIAL_POLICY_NODES,
  ...INITIAL_TUTORIAL_POLICY_NODES,
];

export const INITIAL_IN_LEVEL_NODES: Node<IAMAnyNodeData>[] = [
  ...INITIAL_RESOURCE_NODES,
  ...INITIAL_USER_NODES,
  ...INITIAL_GROUP_NODES,
];
