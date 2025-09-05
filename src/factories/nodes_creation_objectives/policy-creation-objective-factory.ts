import {
  buildCreationObjectiveFactory,
  CreationFactoryOverrides,
} from './build-creation-objectives-factory';
import { BaseFinishEventMap, IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';

export function createPolicyCreationObjective<
  T extends IAMPolicyCreationObjective<BaseFinishEventMap>,
>(overrides: CreationFactoryOverrides<T>): T {
  const factory = buildCreationObjectiveFactory<T>({
    entity: IAMNodeEntity.Policy,
    type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
  });

  return factory(overrides);
}
