import { Node, Edge } from 'reactflow';

import { INITIAL_TUTORIAL_POLICY_NODES } from './nodes/policy-nodes';
import { IAMAnyNodeData } from '@/types';
import { getEdgeName } from '@/utils/names';

export const INITIAL_TUTORIAL_NODES: Node<IAMAnyNodeData>[] = INITIAL_TUTORIAL_POLICY_NODES;

const edgesInfo = [
  {
    source: 'iam_user_1',
    source_handle: 'right',
    target: 'iam_group_1',
    target_handle: 'left',
  },
  {
    source: 'iam_user_2',
    source_handle: 'left',
    target: 'iam_group_1',
    target_handle: 'right',
  },
  {
    source: 'iam_policy_1',
    source_handle: 'top',
    target: 'iam_group_1',
    target_handle: 'bottom',
  },
  {
    source: 'iam_policy_2',
    source_handle: 'top',
    target: 'iam_group_1',
    target_handle: 'bottom',
  },
  {
    source: 'iam_policy_3',
    source_handle: 'top',
    target: 'iam_group_1',
    target_handle: 'bottom',
  },
];

export const edges: Edge[] = edgesInfo.map(({ source, target, source_handle, target_handle }) => ({
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
}));
