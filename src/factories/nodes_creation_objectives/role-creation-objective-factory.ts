import {
  buildCreationObjectiveFactory,
  CreationFactoryOverrides,
} from './build-creation-objectives-factory';
import { BaseFinishEventMap, IAMRoleCreationObjective, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';

export function createRoleCreationObjective<T extends IAMRoleCreationObjective<BaseFinishEventMap>>(
  overrides: CreationFactoryOverrides<T>
): T {
  const factory = buildCreationObjectiveFactory<T>({
    entity: IAMNodeEntity.Role,
    type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
  });

  return factory(overrides);
}
