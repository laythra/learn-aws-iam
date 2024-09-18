import _ from 'lodash';
import type { Edge } from 'reactflow';

import { GroupNodeID } from './nodes/group-nodes';
import { PolicyNodeID } from './nodes/policy-nodes';
import { UserNodeID } from './nodes/user-nodes';
import { getEdgeName } from '@/utils/names';

export const TEMPLATE_EDGE: Edge = {
  id: 'edge',
  source: 'source',
  target: 'target',
  animated: true,
  type: 'straight',
  label: 'Belongs to',
  style: { stroke: '#f6ab6c' },
};

const REQUIRED_EDGES_INFO = [
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

export const REQUIRED_EDGES: Edge[] = REQUIRED_EDGES_INFO.map(
  ({ source, target, source_handle, target_handle }) =>
    _.merge({}, TEMPLATE_EDGE, {
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

const IN_LEVEL_EDGES: Partial<Edge>[] = [
  {
    source: UserNodeID.User1,
    target: GroupNodeID.FrontendGroup,
    sourceHandle: 'right',
    targetHandle: 'left',
  },
  {
    source: UserNodeID.User2,
    target: GroupNodeID.FrontendGroup,
    sourceHandle: 'right',
    targetHandle: 'left',
  },
  {
    source: UserNodeID.User3,
    target: GroupNodeID.BackendGroup,
    sourceHandle: 'left',
    targetHandle: 'right',
  },
  {
    source: UserNodeID.User4,
    target: GroupNodeID.BackendGroup,
    sourceHandle: 'left',
    targetHandle: 'right',
  },
];

export const INITIAL_IN_LEVEL_EDGES: Edge[] = IN_LEVEL_EDGES.map(
  ({ source, target, sourceHandle, targetHandle }) =>
    _.merge({}, TEMPLATE_EDGE, {
      id: getEdgeName(source!, target!),
      source,
      target,
      sourceHandle,
      targetHandle,
    })
);

export const groupedByIdEdges = _.keyBy(REQUIRED_EDGES, 'id');
