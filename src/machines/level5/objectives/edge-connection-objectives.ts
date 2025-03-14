import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: RoleNodeID.FinanceAuditorRole,
          target: UserNodeID.FinanceUser,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_ROLE1_ATTACHED_TO_USER,
      is_finished: false,
      established_edge_hovering_label: 'Assumed by',
      established_edge_target_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: RoleNodeID.S3ReadAccessRole,
          target: UserNodeID.FinanceUser,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_ROLE2_ATTACHED_TO_USER,
      is_finished: false,
      established_edge_hovering_label: 'Assumed by',
      established_edge_target_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: PolicyNodeID.S3ReadPolicy,
          target: RoleNodeID.S3ReadAccessRole,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_POLICY_ATTACHED_TO_ROLE2,
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
          source: PolicyNodeID.UsersCertificatesS3ReadPolicy,
          target: RoleNodeID.LambdaRole,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.S3_READ_POLICY_ATTACHED_TO_LAMBDA_ROLE,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_target_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: PolicyNodeID.UsersCertificatesS3WritePolicy,
          target: RoleNodeID.EC2Role,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.S3_WRITE_POLICY_ATTACHED_TO_EC2_ROLE,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_target_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: RoleNodeID.LambdaRole,
          target: ResourceNodeID.LambdaFunction,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.LAMBDA_ROLE_ATTACHED_TO_LAMBDA_FUNCTION,
      is_finished: false,
      established_edge_hovering_label: 'Assumed by',
      established_edge_target_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: RoleNodeID.EC2Role,
          target: ResourceNodeID.TimeshiftLabsEC2Instance,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.EC2_ROLE_ATTACHED_TO_EC2_INSTANCE,
      is_finished: false,
      established_edge_hovering_label: 'Assumed by',
      established_edge_target_handle: 'bottom',
    },
  ],
];
