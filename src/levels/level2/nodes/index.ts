import { INITIAL_POLICY_NODES } from './policy-nodes';
import { INITIAL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_USER_NODES } from './user-nodes';
import { IAMAnyNode } from '@/types/iam-node-types';

export const INITIAL_LEVEL_NODES: IAMAnyNode[] = [
  ...INITIAL_POLICY_NODES,
  ...INITIAL_RESOURCE_NODES,
  ...INITIAL_USER_NODES,
];
