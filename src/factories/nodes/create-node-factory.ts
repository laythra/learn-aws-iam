import { HandleProps } from '@xyflow/react';

import { getNodeAnimations, NODE_ANIMATION_ID } from '@/config/node-animations';
import { IAMAnyNode, IAMNodeEntity, IAMNodeMap } from '@/types';

interface BaseFactoryConfig<T, E extends IAMNodeEntity> {
  type: string;
  entity: E;
  image: string;
  defaultHandles: HandleProps[];
  width?: number;
  height?: number;
  deletable?: boolean;
  draggable?: boolean;
  initial_position?: string;
  additionalData?: Partial<T>;
}

type RootOverrides = Partial<Omit<IAMAnyNode, 'data'>>;

/**
 * Generic node factory that supports overriding both root and data fields.
 */
export function createNodeFactory<T extends IAMNodeMap[E]['data'], E extends IAMNodeEntity>(
  config: BaseFactoryConfig<T, E>
): (overrides: { rootOverrides?: RootOverrides; dataOverrides?: Partial<T> }) => IAMNodeMap[E] {
  const {
    type,
    entity,
    image,
    defaultHandles,
    width = 225,
    height = 82,
    deletable = false,
    draggable = true,
    initial_position = 'center',
    additionalData = {},
  } = config;

  const TEMPLATE_NODE = {
    id: entity.toLowerCase(),
    position: { x: 0, y: 0 },
    type: type as IAMNodeMap[E]['type'],
    draggable,
    deletable,
    width,
    height,
    data: {
      id: entity.toLowerCase(),
      label: entity.replace('IAM', 'IAM '),
      handles: defaultHandles,
      entity,
      image,
      initial_position,
      animations: getNodeAnimations(NODE_ANIMATION_ID.ShimmerBackground),
      ...additionalData,
    } as T,
  };

  return function createNode({
    rootOverrides,
    dataOverrides,
  }: {
    rootOverrides?: RootOverrides;
    dataOverrides?: Partial<T>;
  }): IAMNodeMap[E] {
    return {
      ...TEMPLATE_NODE,
      ...rootOverrides,
      id: dataOverrides?.id ?? TEMPLATE_NODE.id,
      data: {
        ...TEMPLATE_NODE.data,
        ...dataOverrides,
      },
    } as IAMNodeMap[E];
  };
}
