import {
  buildCreationObjectiveFactory,
  CreationFactoryOverrides,
} from './build-creation-objectives-factory';
import { IAMNodeEntity } from '@/types/iam-enums';
import {
  BaseFinishEventMap,
  IAMIdentityPolicyCreationObjective,
  ObjectiveType,
} from '@/types/objective-types';

export function createPolicyCreationObjective<
  T extends IAMIdentityPolicyCreationObjective<BaseFinishEventMap, string>,
>(overrides: CreationFactoryOverrides<T>): T {
  const factory = buildCreationObjectiveFactory<T>({
    entity: IAMNodeEntity.IdentityPolicy,
    type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
  });

  return factory(overrides);
}
