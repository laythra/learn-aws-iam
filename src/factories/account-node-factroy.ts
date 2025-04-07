import type { HandleProps } from '@xyflow/react';
import { Position } from '@xyflow/react';
import _ from 'lodash';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import { IAMNodeImage, IAMNodeEntity, HandleID, IAMAccountNode } from '@/types';

export const TEMPLATE_POLICY_NODE: IAMAccountNode = {
  id: 'iam_policy',
  position: { x: 0, y: 0 },
  type: 'account',
  draggable: false,
  deletable: false,
  height: 300,
  width: 800,
  data: {
    id: 'iam_policy',
    label: 'IAM Policy',
    entity: IAMNodeEntity.Account,
    handles: [{ id: HandleID.Top, type: 'source', position: Position.Top }] as HandleProps[],
    image: IAMNodeImage.Policy,
    initial_position: 'center',
    animations: getNodeAnimations(NODE_ANIMATION_ID.ShimmerBackground),
  },
};

export function createAccountNode(props: Partial<IAMAccountNode['data']>): IAMAccountNode {
  return _.merge(
    {},
    TEMPLATE_POLICY_NODE,
    { data: props },
    { id: props.id, deletable: props.unnecessary_node }
  );
}
