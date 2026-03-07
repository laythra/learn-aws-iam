import { createGroupNode } from '@/domain/nodes/group-node-factory';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMGroupNode } from '@/types/iam-node-types';

const IN_LEVEL_GROUP_NODES: IAMNodeDataOverrides<IAMGroupNode['data']>[] = [];

export const INITIAL_IN_LEVEL_GROUP_NODES: IAMGroupNode[] = IN_LEVEL_GROUP_NODES.map(nodeData =>
  createGroupNode({ dataOverrides: nodeData, rootOverrides: { draggable: false } })
);
