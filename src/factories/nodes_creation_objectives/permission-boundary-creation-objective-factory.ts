import {
  buildCreationObjectiveFactory,
  CreationFactoryOverrides,
} from './build-creation-objectives-factory';
import {
  BaseCreationObjective,
  BaseFinishEventMap,
  ObjectiveType,
} from '@/levels/types/objective-types';
import { IAMNodeEntity } from '@/types/iam-enums';

export function createPermissionBoundaryCreationObjective<
  T extends BaseCreationObjective<BaseFinishEventMap>,
>(overrides: CreationFactoryOverrides<T>): T {
  const factory = buildCreationObjectiveFactory<T>({
    entity: IAMNodeEntity.PermissionBoundary,
    type: ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE,
  });

  return factory(overrides);
}
