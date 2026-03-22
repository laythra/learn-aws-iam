import {
  buildCreationObjectiveFactory,
  CreationFactoryOverrides,
} from './build-creation-objectives-factory';
import { IAMNodeEntity } from '@/types/iam-enums';
import {
  BaseFinishEventMap,
  IAMRoleCreationObjective,
  ObjectiveType,
} from '@/types/objective-types';

export function createRoleCreationObjective<T extends IAMRoleCreationObjective<BaseFinishEventMap>>(
  overrides: CreationFactoryOverrides<T>
): T {
  const factory = buildCreationObjectiveFactory<T>({
    entity: IAMNodeEntity.Role,
    type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
  });

  return factory(overrides);
}
