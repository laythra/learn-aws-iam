import { Node } from 'reactflow';

import { INITIAL_TUTORIAL_POLICY_NODES } from './policy-nodes';
import { INITIAL_TUTORIAL_RESOURCE_NODES } from './resource-nodes';
import { IAMAnyNodeData } from '@/types';

export const INITIAL_TUTORIAL_NODES: Node<IAMAnyNodeData>[] = [
  ...INITIAL_TUTORIAL_POLICY_NODES,
  ...INITIAL_TUTORIAL_RESOURCE_NODES,
];
export const INITIAL_IN_LEVEL_NODES: Node<IAMAnyNodeData>[] = [];
