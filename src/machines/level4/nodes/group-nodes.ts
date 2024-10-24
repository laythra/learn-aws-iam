import { type Node } from 'reactflow';

import { createGroupNode } from '@/factories/group-node-factory';
import type { IAMGroupNodeData } from '@/types';

export enum GroupNodeID {}

const IN_LEVEL_GROUP_NODES: Partial<IAMGroupNodeData>[] = [];

export const INITIAL_IN_LEVEL_GROUP_NODES: Node<IAMGroupNodeData>[] =
  IN_LEVEL_GROUP_NODES.map(createGroupNode);

export const INITIAL_GROUP_NODES = INITIAL_IN_LEVEL_GROUP_NODES;
