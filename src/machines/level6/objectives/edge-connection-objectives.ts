import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { PolicyNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types/objective-types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.TrustingAccountFinanceReportsReadPolicy,
            target: RoleNodeID.TrustingAccountDynamoDBReadRole,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.DYNAMODB_READ_POLICY_ATTACHED_TO_READ_ROLE,
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
            source: PolicyNodeID.TrustedAccountAssumeRolePolicy,
            target: UserNodeID.TrustedAccountIAMUser,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.ASSUME_ROLE_POLICY_ATTACHED_TO_IAM_USER,
      is_finished: false,
      established_edge_source_handle: 'left',
      established_edge_hovering_label: 'Assumed by',
      established_edge_target_handle: 'right',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: UserNodeID.TrustedAccountIAMUser,
            target: RoleNodeID.TrustingAccountDynamoDBReadRole,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.IAM_USER_ATTACHED_TO_DYNAMO_READ_ROLE,
      is_finished: false,
      established_edge_hovering_label: 'Assumed By',
      established_edge_target_handle: 'right',
      established_edge_source_handle: 'left',
    },
  ],
];
