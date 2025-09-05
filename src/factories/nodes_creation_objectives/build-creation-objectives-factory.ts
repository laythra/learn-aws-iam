import { BaseCreationObjective, BaseFinishEventMap, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';

export type CreationFactoryOverrides<T> = Omit<T, 'finished' | 'type' | 'entity'>;

/**
 * Creates a factory function for generating creation objectives with predefined configuration.
 *
 * This factory ensures type safety by requiring all mandatory fields in the config and
 * auto-generating required fields like `id` and `finished`.
 *
 * @template T - The specific creation objective type extending BaseCreationObjective
 *
 * @param config - Base configuration for the creation objective factory
 * @param config.type - The objective type identifier
 * @param config.entity - The IAM node entity type (Policy, Role, etc.)
 *
 * @returns A factory function that creates typed creation objectives
 */
export function buildCreationObjectiveFactory<
  TObjective extends BaseCreationObjective<BaseFinishEventMap>,
>(config: {
  entity: IAMNodeEntity;
  type: ObjectiveType;
}): (overrides: CreationFactoryOverrides<TObjective>) => TObjective {
  return function createObjective(overrides: CreationFactoryOverrides<TObjective>): TObjective {
    const objective = {
      ...config,
      ...overrides,
      finished: false,
    } satisfies BaseCreationObjective<BaseFinishEventMap>;

    return objective as TObjective;
  };
}
