import { createGroupNode } from '@/factories/group-node-factory';
import type { IAMGroupNode } from '@/types';

export enum GroupNodeID {}

const IN_LEVEL_GROUP_NODES: Partial<IAMGroupNode['data']>[] = [];

export const INITIAL_IN_LEVEL_GROUP_NODES: IAMGroupNode[] =
  IN_LEVEL_GROUP_NODES.map(createGroupNode);

export const INITIAL_GROUP_NODES = INITIAL_IN_LEVEL_GROUP_NODES;
