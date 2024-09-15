import type { Edge } from 'reactflow';

import { GroupNodeID } from './nodes/group-nodes';
import { PolicyNodeID } from './nodes/policy-nodes';
import { getEdgeName } from '@/utils/names';

const requiredEdgesInfo = [
  {
    source: PolicyNodeID.S3ReadWriteAcces,
    target: GroupNodeID.FrontendGroup,
    source_handle: 'top',
    target_handle: 'bottom',
  },
  {
    source: PolicyNodeID.CloudfrontReadAccess,
    target: GroupNodeID.FrontendGroup,
    source_handle: 'top',
    target_handle: 'bottom',
  },
  {
    source: PolicyNodeID.DynamoDBReadWriteAccess,
    target: GroupNodeID.BackendGroup,
    source_handle: 'top',
    target_handle: 'bottom',
  },
];

export const edges: Edge[] = requiredEdgesInfo.map(
  ({ source, target, source_handle, target_handle }) => ({
    id: getEdgeName(source, target),
    source,
    target,
    sourceHandle: source_handle,
    targetHandle: target_handle,
    animated: true,
    arrowHeadType: 'arrowclosed',
    type: source.includes('user') ? 'smoothstep' : 'straight',
    label: source.includes('user') ? 'Belongs to' : 'Attached to',
    style: { stroke: '#f6ab6c' },
  })
);

export const groupedByIdEdges = edges.reduce((memo: { [key: string]: Edge }, edge) => {
  memo[edge.id] = edge;
  return memo;
}, {});
