import { BaseCreationObjective, BaseFinishEventMap, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';

export type CreationFactoryOverrides<T> = Partial<Omit<T, 'id' | 'finished' | 'type' | 'entity'>>;

/**
 * Creates a factory function for generating creation objectives with predefined configuration.
 *
 * This factory ensures type safety by requiring all mandatory fields in the config and
 * auto-generating required fields like `id` and `finished`.
 *
 * @template T - The specific creation objective type extending BaseCreationObjective
 *
 * @param config - Base configuration for the creation objective factory
 * @param conjig.type - The objective type identifier
 * @param config.entity - The entity name/identifier
 * @param config.entity_type - The IAM node entity type (Policy, Role, etc.)
 * @param config.initial_position - Initial position for the created node
 * @param config.on_finish_event - Event to trigger when objective completes
 * @param config.defaults - Default values for optional objective properties
 *
 * @returns A factory function that creates typed creation objectives
 */
export function buildCreationObjectiveFactory<
  TObjective extends BaseCreationObjective<BaseFinishEventMap>,
>(config: {
  entity: IAMNodeEntity;
  type: ObjectiveType;
}): (
  overrides?: CreationFactoryOverrides<BaseCreationObjective<BaseFinishEventMap>>
) => TObjective {
  return function createObjective(
    overrides: CreationFactoryOverrides<BaseCreationObjective<BaseFinishEventMap>> = {}
  ): TObjective {
    const objective = {
      ...config,
      ...overrides,
      finished: false,
    };

    return objective as TObjective;
  };
}
