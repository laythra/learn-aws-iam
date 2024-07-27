import { HandleProps, Node, Position, Edge } from 'reactflow';

import { POLICY_NODES } from './nodes/policy-nodes';
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
  ...Array(3)
    .fill(0)
    .map(
      (_, i) =>
        ({
          id: `iam_user_${i + 1}`,
          position: { x: 200 + i * 200, y: 400 },
          data: {
            id: `iam_user_${i + 1}`,
            label: `user-${i}`,
            entity: IAMNodeEntity.User,
            handles: [
              { id: Position.Top, type: 'source', position: Position.Top },
              { id: Position.Bottom, type: 'target', position: Position.Bottom },
            ] as HandleProps[],
            image: IAMNodeImage.User,
          },
          type: 'iam_default',
          draggable: true,
        }) as Node<IAMUserNodeData>
    ),
  ...POLICY_NODES,
  {
    id: 'iam_resource_1',
    position: { x: 250, y: 100 },
    data: {
      id: 'iam_resource_1',
      description: '',
      label: 'public-images',
      entity: IAMNodeEntity.S3Bucket,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.S3Bucket,
    },
    type: 'iam_default',
    draggable: true,
  },
  {
    id: 'users_table',
    position: { x: 550, y: 100 },
    data: {
      label: 'prod_Users',
      id: 'users_table',
      description: 'Production Tablee',
      entity: IAMNodeEntity.DynamoDBTable,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.Database,
    },
    type: 'iam_default',
    draggable: true,
  },
  {
    id: 'users_table',
    position: { x: 550, y: 100 },
    data: {
      label: 'prod_Users',
      id: 'users_table',
      description: 'Production Tablee',
      entity: IAMNodeEntity.DynamoDBTable,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.Database,
    },
    type: 'iam_default',
    draggable: true,
  },
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
