import { HandleProps } from '@xyflow/react';

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
 * Creates a factory function for generating IAM nodes with customizable properties.
 *
 * @template T - The data type for the node, constrained to IAMNodeMap[E]['data']
 * @template E - The IAM node entity type, constrained to IAMNodeEntity
 *
 * @param config - Configuration object for the node factory
 * @param config.type - The type of the node
 * @param config.entity - The entity type of the node
 * @param config.image - Image associated with the node
 * @param config.defaultHandles - Default handles for the node
 * @param config.width - Width of the node (default: 225)
 * @param config.height - Height of the node (default: 82)
 * @param config.deletable - Whether the node can be deleted (default: false)
 * @param config.draggable - Whether the node can be dragged (default: true)
 * @param config.initial_position - Initial position of the node (default: 'center')
 * @param config.additionalData - Additional data to merge with the node's data (default: {})
 *
 * @returns A factory function that creates IAM nodes with optional overrides
 * @returns factory.rootOverrides - Optional overrides for root-level node properties
 * @returns factory.dataOverrides - Optional overrides for node data properties
 *
 * @example
 * ```typescript
 * const userNodeFactory = createNodeFactory({
 *   type: 'user',
 *   entity: 'User',
 *   image: 'user-icon.png',
 *   defaultHandles: ['source', 'target']
 * });
 *
 * const userNode = userNodeFactory({
 *   dataOverrides: { id: 'user-123', label: 'John Doe' }
 * });
 * ```
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
    extent: 'parent',
    width,
    height,
    data: {
      id: entity.toLowerCase(),
      label: entity,
      handles: defaultHandles,
      entity,
      image,
      initial_position,
      layout_direction: 'horizontal',
      vertical_spacing: height + 20, // 20 so nodes don't completely overlap on each other
      horizontal_spacing: width + 20, // 20 so nodes don't completely overlap on each other
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
      // I don't know if needing two redundant id fields is of any good reason
      id: dataOverrides?.id ?? rootOverrides?.id ?? TEMPLATE_NODE.id,
      deletable: dataOverrides?.unnecessary_node,
      data: {
        ...TEMPLATE_NODE.data,
        ...dataOverrides,
      },
    } as IAMNodeMap[E];
  };
}
