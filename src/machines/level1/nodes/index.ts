import { INITIAL_TUTORIAL_POLICY_NODES } from './policy-nodes';
import { INITIAL_TUTORIAL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_TUTORIAL_USER_NODES } from './user-nodes';
import { IAMAnyNode } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_NODES: IAMAnyNode[] = [
  ...INITIAL_TUTORIAL_POLICY_NODES,
  ...INITIAL_TUTORIAL_RESOURCE_NODES,
  ...INITIAL_TUTORIAL_USER_NODES,
];
export const INITIAL_IN_LEVEL_NODES: IAMAnyNode[] = [];
