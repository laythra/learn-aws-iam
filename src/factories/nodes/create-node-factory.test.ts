import { HandleProps, Position } from '@xyflow/react';
import { describe, it, expect } from 'vitest';

import { createNodeFactory } from './create-node-factory';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

describe('createNodeFactory', () => {
  const defaultHandles: HandleProps[] = [
    { id: 'handle-1', position: Position.Top, type: 'source' },
    { id: 'handle-2', position: Position.Bottom, type: 'source' },
  ];

  const baseConfig = {
    type: 'custom-node',
    entity: IAMNodeEntity.User,
    image: 'custom-image.png',
    defaultHandles,
    width: 300,
    height: 100,
    draggable: false,
    initial_position: 'top-left',
    additionalData: { customField: 'customValue' },
  };

  const baseExpectedData = {
    entity: IAMNodeEntity.User,
    image: 'custom-image.png',
    initial_position: 'top-left',
    layout_direction: 'horizontal',
    horizontal_spacing: baseConfig.width + 20,
    vertical_spacing: baseConfig.height + 20,
  };

  const factory = createNodeFactory(baseConfig);

  it('should create a node with default configuration', () => {
    const node = factory({ dataOverrides: { id: 'default-id' } });

    expect(node).toEqual({
      id: 'default-id',
      position: { x: 0, y: 0 },
      type: 'custom-node',
      draggable: false,
      width: 300,
      height: 100,
      extent: 'parent',
      deletable: false,
      data: {
        id: 'default-id',
        label: IAMNodeEntity.User,
        handles: defaultHandles,
        customField: 'customValue',
        ...baseExpectedData,
      },
    });
  });

  it('should override root properties', () => {
    const rootOverrides = { draggable: true, type: 'resource' } satisfies Partial<IAMAnyNode>;
    const node = factory({
      rootOverrides,
      dataOverrides: { id: 'custom-id' },
    });

    expect(node).toEqual({
      id: 'custom-id',
      position: { x: 0, y: 0 },
      width: 300,
      height: 100,
      extent: 'parent',
      deletable: false,
      ...rootOverrides,
      data: {
        id: 'custom-id',
        label: IAMNodeEntity.User,
        handles: defaultHandles,
        customField: 'customValue',
        ...baseExpectedData,
      },
    });
  });

  it('should override data properties', () => {
    const dataOverrides = {
      id: 'default-id',
      customField: 'custom-value',
      label: "musashi, you've become kinder",
      handles: [],
    } satisfies Partial<IAMAnyNode['data']>;
    const node = factory({
      dataOverrides,
    });

    expect(node).toEqual({
      id: 'default-id',
      position: { x: 0, y: 0 },
      type: 'custom-node',
      draggable: false,
      width: 300,
      height: 100,
      extent: 'parent',
      deletable: false,
      data: {
        ...baseExpectedData,
        ...dataOverrides,
      },
    });
  });

  it('should combine root and data overrides', () => {
    const rootOverrides = {
      width: 400,
      draggable: true,
    } satisfies Partial<IAMAnyNode>;

    const dataOverrides = {
      id: 'data-override-id',
      customField: 'combinedValue',
      label: 'Overridden Label',
      handles: [],
      show_pulse_animation: true,
    } satisfies Partial<IAMAnyNode['data']>;

    const node = factory({
      rootOverrides,
      dataOverrides,
    });

    expect(node).toEqual({
      id: 'data-override-id',
      position: { x: 0, y: 0 },
      type: 'custom-node',
      height: 100,
      extent: 'parent',
      deletable: false,
      ...rootOverrides,
      data: {
        ...baseExpectedData,
        ...dataOverrides,
      },
    });
  });
});
