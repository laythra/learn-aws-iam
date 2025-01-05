import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { PolicyNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: PolicyNodeID.DynamoDBTableReadAccess,
          target: RoleNodeID.DynamoDBReadRole,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.DYNAMODB_READ_POLICY_ATTACHED_TO_READ_ROLE,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: PolicyNodeID.AssumeRolePolicy,
          target: UserNodeID.OriginatingAccountAuditorUser,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.ASSUME_ROLE_POLICY_ATTACHED_TO_IAM_USER,
      is_finished: false,
      established_edge_hovering_label: 'Assumed by',
      established_edge_target_handle: 'bottom',
    },
  ],
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: RoleNodeID.DynamoDBReadRole,
          target: UserNodeID.OriginatingAccountAuditorUser,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.DYNANODB_READ_ROLE_ATTACHED_TO_IAM_USER,
      is_finished: false,
      established_edge_hovering_label: 'Assumed By',
      established_edge_target_handle: 'bottom',
    },
  ],
];
