import {
  buildCreationObjectiveFactory,
  CreationFactoryOverrides,
} from './build-creation-objectives-factory';
import { IAMNodeEntity } from '@/types/iam-enums';
import { BaseCreationObjective, BaseFinishEventMap, ObjectiveType } from '@/types/objective-types';

export function createPermissionBoundaryCreationObjective<
  T extends BaseCreationObjective<BaseFinishEventMap>,
>(overrides: CreationFactoryOverrides<T>): T {
  const factory = buildCreationObjectiveFactory<T>({
    entity: IAMNodeEntity.PermissionBoundary,
    type: ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE,
  });

  return factory(overrides);
}
