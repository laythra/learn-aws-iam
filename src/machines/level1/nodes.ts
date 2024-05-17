import { HandleProps, Node, Position, Edge } from 'reactflow';

import { IAMNodeEntity, IAMCanvasNodeProps } from '@/types';

export const nodes: Node[] = [
  {
    id: 'iam_policy1',
    position: { x: 250, y: 250 },
    data: {
      label: 'IAM Policy',
      entity: IAMNodeEntity.Policy,
      handles: [
        { id: 'a', type: 'source', position: Position.Top },
        { id: 'c', type: 'source', position: Position.Bottom },
      ] as HandleProps[],
    } as IAMCanvasNodeProps,
    style: { zIndex: 10 },
    type: 'iam_default',
  },
  {
    id: 'iam_user1',
    position: { x: 500, y: 0 },
    data: {
      label: 'IAM User',
      entity: IAMNodeEntity.User,
      handles: [
        { id: 'a', type: 'source', position: Position.Top },
        { id: 'c', type: 'target', position: Position.Bottom },
        { id: 'd', type: 'target', position: Position.Left },
      ] as HandleProps[],
    } as IAMCanvasNodeProps,
    style: { zIndex: 10 },
    type: 'iam_default',
  },
  {
    id: 'iam_resource1',
    position: { x: 750, y: 0 },
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
    // sourceNode: nodes[0],
    // targetNode: nodes[1],
    sourceHandle: 'c', // Hardcoding this is super error prone. Need to find a better way
    targetHandle: 'a',
  },
  'e-iam_user1-iam_resource1': {
    id: 'e-iam_user1-iam_resource1',
    source: 'iam_user1',
    target: 'iam_resource1',
    // sourceNode: nodes[1],
    // targetNode: nodes[2],
    sourceHandle: 'a',
    targetHandle: 'a',
    type: 'smoothstep',
  },
};
