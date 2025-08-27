import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { type IAMGroupNode } from '@/types';

const IN_LEVEL_GROUP_NODES: Partial<IAMGroupNode['data']>[] = [];

export const INITIAL_IN_LEVEL_GROUP_NODES: IAMGroupNode[] = IN_LEVEL_GROUP_NODES.map(nodeData =>
  createGroupNode({ dataOverrides: nodeData, rootOverrides: { draggable: false } })
);
