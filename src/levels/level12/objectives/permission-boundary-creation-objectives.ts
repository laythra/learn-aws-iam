import { LayoutGroupID } from '../layout-groups';
import { GuardRailsBlockedEdgesFnName } from '../level-runtime-fns';
import { PERMISSION_BOUNDARY_ALERT_MESSAGE } from '../tutorial_messages/node-tooltip-messages';
import { FinishEventMap, PermissionBoundaryCreationFinishEvent } from '../types/finish-event-enums';
import { PermissionBoundaryID } from '../types/node-ids';
import { createPermissionBoundaryCreationObjective } from '@/domain/nodes_creation_objectives/permission-boundary-creation-objective-factory';
import { MANAGED_POLICIES } from '@/levels/consts';
import {
  IAMPermissionBoundaryCreationObjective,
  ObjectiveType,
} from '@/levels/types/objective-types';
import { IAMNodeEntity } from '@/types/iam-enums';

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
      node_tooltip: PERMISSION_BOUNDARY_ALERT_MESSAGE,
      layout_group_id: LayoutGroupID.InLevelPermissionBoundaryLayoutGroup,
      extra_data: {
        blocked_edge_content: 'Access Blocked By Permission Boundary 🔒',
        is_edge_blocked_fn_name: 'PB1BlockingFN',
      },
    } satisfies Partial<
      IAMPermissionBoundaryCreationObjective<FinishEventMap, GuardRailsBlockedEdgesFnName>
    >,
  ].map(objective => createPermissionBoundaryCreationObjective(objective)),
];
