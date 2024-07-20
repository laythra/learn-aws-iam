import { HandleProps, Node, Position, Edge, MarkerType } from 'reactflow';

import { POLICY_CONTENT } from './config';
import { IAMNodeEntity, IAMCanvasNodeData, IAMNodeImage } from '@/types';
import { getEdgeName } from '@/utils/names';

export const template_nodes: { [key: string]: Node<IAMCanvasNodeData> } = {
  iam_user: {
    id: 'iam_user',
    position: { x: 500, y: 250 },
    type: 'iam_default',
    draggable: true,
    data: {
      label: 'IAM User',
      entity: IAMNodeEntity.User,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.User,
    } as IAMCanvasNodeData,
  },
};

export const initial_nodes: Node[] = [
  {
    id: 'iam_resource_1',
    position: { x: 500, y: 250 },
    data: {
      label: 'public-images',
      entity: IAMNodeEntity.S3Bucket,
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
      image: IAMNodeImage.S3Bucket,
    } as IAMCanvasNodeData,
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
      code: POLICY_CONTENT,
    } as IAMCanvasNodeData,
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
    label: 'Invalid attach policies to resources',
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
