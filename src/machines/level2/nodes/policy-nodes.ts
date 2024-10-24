import type { Node, HandleProps } from 'reactflow';
import { Position } from 'reactflow';

import { INITIAL_POLICIES_INFO } from '../config';
import { theme } from '@/theme';
import { IAMPolicyNodeData, IAMNodeImage, IAMNodeEntity } from '@/types';

export const X_OFFSET = theme.sizes.iamNodeWidthInPixels;
export const Y_OFFSET = 450;

export const INITIAL_POLICY_NODES: Node<IAMPolicyNodeData>[] = INITIAL_POLICIES_INFO.map(
  ({ id, label, content, granted_accesses }, index) => ({
    id,
    position: { x: X_OFFSET + index * X_OFFSET, y: Y_OFFSET },
    data: {
      id,
      label,
      entity: IAMNodeEntity.Policy,
      image: IAMNodeImage.Policy,
      content,
      granted_accesses,
      associated_users: [],
      description: '',
      handles: [
        { id: Position.Top, type: 'source', position: Position.Top },
        { id: Position.Bottom, type: 'target', position: Position.Bottom },
      ] as HandleProps[],
    },
    type: 'iam_default',
    draggable: false,
  })
);
