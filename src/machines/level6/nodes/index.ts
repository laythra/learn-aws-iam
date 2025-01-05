import { Node } from 'reactflow';

import { INITIAL_IN_LEVEL_RESOURCE_NODES } from './resource-nodes';
import { INITIAL_IN_LEVEL_USER_NODES } from './user-nodes';
import { IAMAnyNodeData } from '@/types';

export const INITIAL_TUTORIAL_NODES: Node<IAMAnyNodeData>[] = [];
export const INITIAL_IN_LEVEL_NODES: Node<IAMAnyNodeData>[] = [
  ...INITIAL_IN_LEVEL_RESOURCE_NODES,
  ...INITIAL_IN_LEVEL_USER_NODES,
];
