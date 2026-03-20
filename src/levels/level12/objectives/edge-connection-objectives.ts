import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import {
  AccountID,
  GroupNodeID,
  OUNodeID,
  PermissionBoundaryID,
  PolicyNodeID,
  ResourceNodeID,
  RoleNodeID,
  SCPNodeID,
  UserNodeID,
} from '../types/node-ids';
import { createEdge } from '@/domain/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/levels/types/objective-types';
import { HandleID } from '@/types/iam-enums';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: SCPNodeID.BlockCloudTrailDeletionSCP,
            target: OUNodeID.TutorialOU,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.COULDTRAIL_SCP_CONNECTED,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_source_handle: HandleID.Left,
      established_edge_target_handle: HandleID.Right,
    },
  ],
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: SCPNodeID.RestrictEC2RegionSCP,
            target: AccountID.InLevelStagingAccount,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.EC2_REGION_SCP_CONNECTED,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_source_handle: HandleID.Bottom,
      established_edge_target_handle: HandleID.Top,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: ResourceNodeID.InLevelStagingEC2Instance,
            target: RoleNodeID.S3WriteAccessRole,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TRUST_POLICY_ATTACHED_TO_EC2_INSTANCE,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_source_handle: HandleID.Left,
      established_edge_target_handle: HandleID.Right,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.S3WriteAccessPolicy,
            target: RoleNodeID.S3WriteAccessRole,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.S3_WRITE_POLICY_ATTACHED_TO_ROLE,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_source_handle: HandleID.Right,
      established_edge_target_handle: HandleID.Left,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.ElasticCacheManagementPolicy,
            target: GroupNodeID.InLevelNotificationsTeamGroup,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.EC_MANAGEMENT_POLICY_ATTACHED_TO_GROUP1,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_source_handle: HandleID.Bottom,
      established_edge_target_handle: HandleID.Top,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.ElasticCacheManagementPolicy,
            target: GroupNodeID.InLevelSearchTeamGroup,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.EC_MANAGEMENT_POLICY_ATTACHED_TO_GROUP2,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_source_handle: HandleID.Bottom,
      established_edge_target_handle: HandleID.Top,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.ElasticCacheManagementPolicy,
            target: GroupNodeID.InLevelPaymentsTeamGroup,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.EC_MANAGEMENT_POLICY_ATTACHED_TO_GROUP3,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_source_handle: HandleID.Bottom,
      established_edge_target_handle: HandleID.Top,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PermissionBoundaryID.Ec2LaunchPermissionBoundary,
            target: RoleNodeID.EC2LaunchRole,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.EC2_LAUNCH_PB_ATTACHED_TO_ROLE,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_source_handle: HandleID.Top,
      established_edge_target_handle: HandleID.Bottom,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.AccessDelegationPolicy,
            target: UserNodeID.Alex,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.ACCESS_DELEGATION_POLICY_ATTACHED_TO_USER,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_source_handle: HandleID.Top,
      established_edge_target_handle: HandleID.Bottom,
    },
  ],
];
