import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { PermissionBoundaryID, PolicyNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.Policy1,
            target: UserNodeID.Sephiroth,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_POLICY1_ATTACHED_TO_USER,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
  ],
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PermissionBoundaryID.SecretsReadingPermissionBoundary,
            target: RoleNodeID.Role1,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.PERMISSION_BOUNDARY_CONNECTED_TO_ROLE,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.AccessDelegationPolicy,
            target: UserNodeID.Cloud,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.ACCESS_DELEGATION_POLICY_CONNECTED_TO_CLOUD,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'right',
      established_edge_source_handle: 'top',
    },
  ],
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.FullAccessPolicy,
            target: RoleNodeID.Role1,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.ADMINISTRATOR_POLICY_ATTACHED_TO_ROLE,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'top',
      established_edge_source_handle: 'bottom',
    },
  ],
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: UserNodeID.Tifa,
            target: RoleNodeID.Role1,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TIFA_USER_ATTACHED_TO_ROLE,
      is_finished: false,
      established_edge_hovering_label: 'Assumes',
      established_edge_target_handle: 'right',
      established_edge_source_handle: 'left',
    },
  ],
];
