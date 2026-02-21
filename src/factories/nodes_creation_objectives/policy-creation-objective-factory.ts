import {
  buildCreationObjectiveFactory,
  CreationFactoryOverrides,
} from './build-creation-objectives-factory';
import {
  BaseFinishEventMap,
  IAMPermissionPolicyCreationObjective,
  ObjectiveType,
} from '@/levels/types/objective-types';
import { IAMNodeEntity } from '@/types/iam-enums';

export function createPolicyCreationObjective<
  T extends IAMPermissionPolicyCreationObjective<BaseFinishEventMap, string>,
>(overrides: CreationFactoryOverrides<T>): T {
  const factory = buildCreationObjectiveFactory<T>({
    entity: IAMNodeEntity.Policy,
    type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
  });

  return factory(overrides);
}
