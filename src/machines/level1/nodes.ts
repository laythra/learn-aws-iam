import { HandleProps, Node, Position, Edge, MarkerType } from 'reactflow';

import { POLICY_CONTENT } from './config';
import {
  IAMNodeEntity,
  IAMAnyNodeData,
  IAMNodeImage,
  IAMPolicyNodeData,
  IAMNodeDataMapping,
  IAMResourceNodeData,
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
      description: '',
      label: 'IAM User',
      entity: IAMNodeEntity.User,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.User,
      associated_policies: [],
    },
  },
  iam_group: {
    id: 'iam_group',
    position: { x: 500, y: 250 },
    type: 'iam_default',
    draggable: true,
    data: {
      id: 'iam_group',
      description: '',
      label: 'IAM Group',
      entity: IAMNodeEntity.Group,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.Group,
      attached_users: [],
      attached_policies: [],
    },
  },
};

export const initial_nodes: Node<IAMAnyNodeData>[] = [
  {
    id: 'iam_resource_1',
    position: { x: 500, y: 250 },
    data: {
      label: 'public-images',
      entity: IAMNodeEntity.Resource,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.S3Bucket,
    } as IAMResourceNodeData,
    type: 'iam_default',
    draggable: true,
  },
  {
    id: 'iam_policy_1',
    position: { x: 250, y: 250 },
    data: {
      label: 's3-read-access',
      entity: IAMNodeEntity.Policy,
      description: 'A customer managed policy that allows access to S3 buckets',
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.Policy,
      content: POLICY_CONTENT,
    } as IAMPolicyNodeData,
    type: 'iam_default',
    draggable: true,
  },
];

const edgesInfo: [string, string][] = [
  ['iam_policy_1', 'iam_resource_1'],
  ['iam_policy_1', 'iam_user_1'],
  ['iam_user_1', 'iam_resource_1'],
];

export const edges: Edge[] = [
  {
    id: getEdgeName(...edgesInfo[0]),
    source: edgesInfo[0][0],
    target: edgesInfo[0][1],
    sourceHandle: Position.Bottom,
    targetHandle: Position.Top,
    label: "Invalid - can't attach policies to resources directly",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 1 },
    markerEnd: { type: MarkerType.Arrow, width: 12, height: 12, strokeWidth: 4 },
    animated: true,
  },
  {
    id: getEdgeName(...edgesInfo[1]),
    source: edgesInfo[1][0],
    target: edgesInfo[1][1],
    sourceHandle: Position.Bottom,
    targetHandle: Position.Top,
    label: 'Policy attached to',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 1 },
    markerEnd: { type: MarkerType.Arrow, width: 12, height: 12, strokeWidth: 4 },
    animated: true,
  },
  {
    id: getEdgeName(...edgesInfo[2]),
    source: edgesInfo[2][0],
    target: edgesInfo[2][1],
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'red' },
    sourceHandle: Position.Bottom,
    targetHandle: Position.Top,
    label: 'Has access to',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 1 },
    markerEnd: { type: MarkerType.Arrow, width: 12, height: 12, strokeWidth: 4 },
  },
];
