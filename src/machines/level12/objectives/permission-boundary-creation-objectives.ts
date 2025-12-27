import { GuardRailsBlockedEdgesFnName } from '../level-runtime-fns';
import { FinishEventMap, PermissionBoundaryCreationFinishEvent } from '../types/finish-event-enums';
import { PermissionBoundaryID } from '../types/node-id-enums';
import { createPermissionBoundaryCreationObjective } from '@/factories/nodes_creation_objectives/permission-boundary-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import {
  IAMPermissionBoundaryCreationObjective,
  ObjectiveType,
} from '@/machines/types/objective-types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types';

// eslint-disable-next-line max-len
export const PERMISSION_BOUNDARY_CREATION_OBJECTIVES: IAMPermissionBoundaryCreationObjective<
  FinishEventMap,
  GuardRailsBlockedEdgesFnName
>[][] = [
  [
    {
      id: PermissionBoundaryID.Ec2LaunchPermissionBoundary,
      type: ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.PermissionBoundary,
      on_finish_event: PermissionBoundaryCreationFinishEvent.ROLE_DELEGATION_PB_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
      extra_data: {
        blocked_edge_content: 'Access Blocked By Permission Boundary 🔒',
        is_edge_blocked_fn_name: 'PB1BlockingFN',
      },
    } satisfies Partial<
      IAMPermissionBoundaryCreationObjective<FinishEventMap, GuardRailsBlockedEdgesFnName>
    >,
  ].map(objective => createPermissionBoundaryCreationObjective(objective)),
];
