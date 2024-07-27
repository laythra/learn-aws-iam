import { HandleProps, Node, Position, Edge } from 'reactflow';

import { POLICY_NODES } from './nodes/policy-nodes';
import { RESOURCE_NODES } from './nodes/resource-nodes';
import { USER_NODES } from './nodes/user-nodes';
import {
  IAMNodeEntity,
  IAMNodeImage,
  IAMAnyNodeData,
  IAMUserNodeData,
  IAMNodeDataMapping,
} from '@/types';
import { getEdgeName } from '@/utils/names';

export const template_nodes: { [K in keyof IAMNodeDataMapping]: Node<IAMNodeDataMapping[K]> } = {
  iam_user: {
    id: 'iam_user',
    position: { x: 500, y: 250 },
    type: 'iam_default',
    draggable: true,
    data: {
      id: 'iam_user',
      label: 'IAM User',
      entity: IAMNodeEntity.User,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.User,
      associated_policies: [],
      description: '',
    },
  },
  iam_group: {
    id: 'iam_group',
    position: { x: 500, y: 250 },
    type: 'iam_default',
    draggable: true,
    data: {
      id: 'iam_group',
      label: 'IAM Group',
      entity: IAMNodeEntity.Group,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.Group,
      attached_users: [],
      attached_policies: [],
      description: '',
    },
  },
};

export const initial_nodes: Node<IAMAnyNodeData>[] = [
  ...USER_NODES,
  ...POLICY_NODES,
  ...RESOURCE_NODES,
];

const edgesInfo: [string, string][] = [
  ['iam_policy_1', 'iam_group_1'],
  ['iam_policy_2', 'iam_group_1'],
  ['iam_policy_3', 'iam_group_1'],
  ['iam_user_1', 'iam_group_1'],
  ['iam_user_2', 'iam_group_1'],
  ['iam_user_3', 'iam_group_1'],
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
