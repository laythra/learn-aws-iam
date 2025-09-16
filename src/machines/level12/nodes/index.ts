import { INITIAL_TUTORIAL_ACCOUNT_NODES } from './account-nodes';
import { INITIAL_TUTORIAL_GROUP_NODES } from './group-nodes';
import { INITIAL_TUTORIAL_OU_NODES } from './ou-nodes';
import { INITIAL_TUTORIAL_POLICY_NODES } from './policy-nodes';
import { INITIAL_TUTORIAL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_TUTORIAL_SCP_NODES } from './scp-nodes';
import { INITIAL_TUTORIAL_USER_NODES } from './user-nodes';
import { IAMAnyNode } from '@/types';

export const INITIAL_TUTORIAL_NODES: IAMAnyNode[] = [
  ...INITIAL_TUTORIAL_ACCOUNT_NODES,
  ...INITIAL_TUTORIAL_OU_NODES,
  ...INITIAL_TUTORIAL_USER_NODES,
  ...INITIAL_TUTORIAL_RESOURCE_NODES,
  ...INITIAL_TUTORIAL_GROUP_NODES,
  ...INITIAL_TUTORIAL_POLICY_NODES,
  ...INITIAL_TUTORIAL_SCP_NODES,
];

export const INITIAL_IN_LEVEL_NODES: IAMAnyNode[] = [];
