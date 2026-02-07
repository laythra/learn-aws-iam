import { INITIAL_IN_LEVEL_GROUP_NODES } from './group-nodes';
import { INITIAL_IN_LEVEL_POLICY_NODES } from './policy-nodes';
import { INITIAL_IN_LEVEL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_IN_LEVEL_USER_NODES } from './user-nodes';
import { IAMAnyNode } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_NODES: IAMAnyNode[] = [];

export const INITIAL_IN_LEVEL_NODES: IAMAnyNode[] = [
  ...INITIAL_IN_LEVEL_USER_NODES,
  ...INITIAL_IN_LEVEL_RESOURCE_NODES,
  ...INITIAL_IN_LEVEL_POLICY_NODES,
  ...INITIAL_IN_LEVEL_GROUP_NODES,
];
