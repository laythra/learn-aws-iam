import type { ValidateFunction } from 'ajv';

import { GetLevelValidateFunctions } from '@/levels/utils/functions-registry';
import { useLevelSelector } from '@/runtime/level-runtime';
import type { IAMAnyNode } from '@/types/iam-node-types';

export const useLevelValidateFunctions = (): Record<
  string,
  (nodes: IAMAnyNode[]) => ValidateFunction
> => {
  const levelNumber = useLevelSelector(state => state.context.level_number);
  return GetLevelValidateFunctions(levelNumber);
};
