import { Node, Edge } from 'reactflow';

import { INITIAL_POLICY_NODES } from './nodes/policy-nodes';
import { INITIAL_RESOURCE_NODES } from './nodes/resource-nodes';
import { INITIAL_USER_NODES } from './nodes/user-nodes';
import { IAMAnyNodeData } from '@/types';
import { getEdgeName } from '@/utils/names';

export const initial_nodes: Node<IAMAnyNodeData>[] = [
  ...INITIAL_POLICY_NODES,
  ...INITIAL_USER_NODES,
  ...INITIAL_RESOURCE_NODES,
];

const edgesInfo: [string, string][] = [
  ['iam_policy_1', 'iam_group_1'],
  ['iam_policy_2', 'iam_group_1'],
  ['iam_policy_3', 'iam_group_1'],
  ['iam_user_1', 'iam_group_1'],
  ['iam_user_2', 'iam_group_1'],
  ['iam_user_3', 'iam_group_1'],
  ['iam_user', 'iam_group_1'],
];

export const edges: Edge[] = edgesInfo.map(([source, target]) => ({
  id: getEdgeName(source, target),
  source,
  target,
  animated: true,
  arrowHeadType: 'arrowclosed',
  type: source.includes('user') ? 'smoothstep' : 'straight',
  label: source.includes('user') ? 'Belongs to' : 'Attached to',
  style: { stroke: '#f6ab6c' },
}));
