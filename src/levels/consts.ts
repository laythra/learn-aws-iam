import { IAMCodeDefinedEntities } from '@/config/consts';
import { createHorizontalGroup, createVerticalGroup } from '@/domain/layout-group-factory';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { LAYOUT_DIRECTIONS } from '@/types/iam-layout-types';
import { VALID_INITIAL_POSITIONS } from '@/types/iam-layout-types';

export const DEFAULT_ROLE_POLICY_OBJECTIVES_MAP = IAMCodeDefinedEntities.reduce(
  (acc, entity) => {
    acc[entity] = { objectives: [], current_index: 0 };
    return acc;
  },
  {} as Record<IAMNodeEntity, { objectives: []; current_index: number }>
);

export const COMMON_LAYOUT_GROUPS = VALID_INITIAL_POSITIONS.flatMap(position =>
  LAYOUT_DIRECTIONS.map(direction => {
    const key = `${position}-${direction}` as CommonLayoutGroupID;
    return direction === 'vertical'
      ? createVerticalGroup(key, position)
      : createHorizontalGroup(key, position);
  })
);
