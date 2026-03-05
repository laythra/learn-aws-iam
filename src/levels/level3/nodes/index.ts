import { INITIAL_GROUP_NODES } from './group-nodes';
import { INITIAL_TUTORIAL_POLICY_NODES } from './identity-policy-nodes';
import { INITIAL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_USER_NODES } from './user-nodes';
import { IAMAnyNode } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_NODES: IAMAnyNode[] = [...INITIAL_TUTORIAL_POLICY_NODES];

export const INITIAL_IN_LEVEL_NODES: IAMAnyNode[] = [
  ...INITIAL_RESOURCE_NODES,
  ...INITIAL_USER_NODES,
  ...INITIAL_GROUP_NODES,
];
