import { Node } from 'reactflow';

import { INITIAL_POLICY_NODES } from './policy-nodes';
import { INITIAL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_USER_NODES } from './user-nodes';
import { IAMAnyNodeData } from '@/types';

export const INITIAL_LEVEL_NODES: Node<IAMAnyNodeData>[] = [
  ...INITIAL_POLICY_NODES,
  ...INITIAL_RESOURCE_NODES,
  ...INITIAL_USER_NODES,
];
