import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID, RoleNodeID, UserNodeID } from '../types/node-ids';
import { createEdge } from '@/domain/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/levels/types/objective-types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: UserNodeID.FinanceUser, target: RoleNodeID.FinanceAuditorRole },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_ROLE1_ATTACHED_TO_USER,
      is_finished: false,
      established_edge_hovering_label: 'Assumes',
      established_edge_target_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: UserNodeID.FinanceUser, target: RoleNodeID.S3ReadAccessRole },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_ROLE2_ATTACHED_TO_USER,
      is_finished: false,
      established_edge_hovering_label: 'Assumes',
      established_edge_target_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: PolicyNodeID.S3ReadPolicy, target: RoleNodeID.S3ReadAccessRole },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_POLICY_ATTACHED_TO_ROLE2,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_target_handle: 'bottom',
    },
  ],
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.ChatImagesS3ReadPolicy,
            target: RoleNodeID.LambdaRole,
          },
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
          rootOverrides: {
            source: PolicyNodeID.ChatImagesS3WritePolicy,
            target: RoleNodeID.EC2Role,
          },
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
          rootOverrides: { source: ResourceNodeID.LambdaFunction, target: RoleNodeID.LambdaRole },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.LAMBDA_ROLE_ATTACHED_TO_LAMBDA_FUNCTION,
      is_finished: false,
      established_edge_hovering_label: 'Assumes',
      established_edge_source_handle: 'left',
      established_edge_target_handle: 'right',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: ResourceNodeID.TimeshiftLabsEC2Instance,
            target: RoleNodeID.EC2Role,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.EC2_ROLE_ATTACHED_TO_EC2_INSTANCE,
      is_finished: false,
      established_edge_hovering_label: 'Assumes',
      established_edge_source_handle: 'right',
      established_edge_target_handle: 'left',
    },
  ],
];
