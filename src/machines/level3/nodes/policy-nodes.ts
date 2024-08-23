import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { INITIAL_POLICIES_INFO } from '../config';
import { theme } from '@/theme';
import { IAMPolicyNodeData, IAMNodeImage, IAMNodeEntity } from '@/types';

export const X_OFFSET = theme.sizes.iamNodeWidthInPixels;
export const Y_OFFSET = 450;

export const INITIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] = INITIAL_POLICIES_INFO.map(
  ({ id, label, code, resources_affected }) => ({
    id,
    position: { x: 0, y: 0 },
    type: 'iam_default',
    draggable: false,
    data: {
      id,
      label,
      entity: IAMNodeEntity.Policy,
      image: IAMNodeImage.Policy,
      code,
      resources_affected,
      initial_position: 'center',
      description: '',
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'source', position: Position.Bottom },
      ] as HandleProps[],
    },
  })
);
