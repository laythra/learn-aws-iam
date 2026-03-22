import {
  buildCreationObjectiveFactory,
  CreationFactoryOverrides,
} from './build-creation-objectives-factory';
import { IAMNodeEntity } from '@/types/iam-enums';
import {
  BaseFinishEventMap,
  IAMResourcePolicyCreationObjective,
  ObjectiveType,
} from '@/types/objective-types';

export function createResourcePolicyCreationObjective<
  T extends IAMResourcePolicyCreationObjective<BaseFinishEventMap>,
>(overrides: CreationFactoryOverrides<T>): T {
  const factory = buildCreationObjectiveFactory<T>({
    entity: IAMNodeEntity.ResourcePolicy,
    type: ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE,
  });

  return factory(overrides);
}
