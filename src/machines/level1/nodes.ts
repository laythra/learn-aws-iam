import { HandleProps, Node, Position, Edge, MarkerType } from 'reactflow';
import type { EdgeMarkerType } from 'reactflow';

import { IAMNodeEntity, IAMCanvasNodeProps } from '@/types';

export const template_nodes: { [key: string]: Node<IAMCanvasNodeProps> } = {
  iam_user: {
    id: 'iam_user',
    position: { x: 500, y: 250 },
    type: 'iam_default',
    draggable: true,
    data: {
      label: 'IAM User',
      entity: IAMNodeEntity.User,
      handles: [
        { id: 'a', type: 'source', position: Position.Top },
        { id: 'b', type: 'target', position: Position.Right },
        { id: 'c', type: 'source', position: Position.Bottom },
        { id: 'd', type: 'target', position: Position.Left },
      ] as HandleProps[],
    } as IAMCanvasNodeProps,
  },
};

export const initial_nodes: Node[] = [
  {
    id: 'iam_policy1',
    position: { x: 250, y: 250 },
    data: {
      label: 'IAM Policy',
      entity: IAMNodeEntity.Policy,
      description: 'A customer managed policy that allows access to S3 buckets',
      handles: [
        { id: 'a', type: 'source', position: Position.Top },
        { id: 'c', type: 'source', position: Position.Bottom },
      ] as HandleProps[],
    } as IAMCanvasNodeProps,
    type: 'iam_default',
    zIndex: 12,
    draggable: false,
  },
  {
    id: 'iam_resource1',
    position: { x: 500, y: 250 },
    data: {
      label: 'S3 Bucket',
      entity: IAMNodeEntity.Resource,
      handles: [
        { id: 'a', type: 'target', position: Position.Top },
        { id: 'b', type: 'target', position: Position.Right },
        { id: 'c', type: 'target', position: Position.Bottom },
        { id: 'd', type: 'target', position: Position.Left },
      ] as HandleProps[],
    } as IAMCanvasNodeProps,
    type: 'iam_default',
    draggable: false,
  },
];

const edgesNames = ['e-iam_policy1-iam_user1', 'e-iam_user1-iam_resource1'] as const;

export const edges: { [key in (typeof edgesNames)[number]]: Edge } = {
  'e-iam_policy1-iam_user1': {
    id: 'e-iam_policy1-iam_user1',
    source: 'iam_policy1',
    target: 'iam_user1',
    label: 'Attached to',
  },
  'e-iam_user1-iam_resource1': {
    id: 'e-iam_user1-iam_resource1',
    source: 'iam_user1',
    target: 'iam_resource1',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'red' },
    label: 'Has access to',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 1 },
    markerEnd: { type: MarkerType.Arrow, width: 20, height: 20, strokeWidth: 4 },
  },
};
