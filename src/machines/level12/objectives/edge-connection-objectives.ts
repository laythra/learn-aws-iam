import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import {
  AccountID,
  GroupNodeID,
  OUNodeID,
  PolicyNodeID,
  ResourceNodeID,
  RoleNodeID,
  SCPNodeID,
} from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';
import { HandleID } from '@/types/iam-node-types';

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
            source: RoleNodeID.S3WriteAccessRole,
            target: ResourceNodeID.InLevelStagingEC2Instance,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TRUST_POLICY_ATTACHED_TO_EC2_INSTANCE,
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
            source: PolicyNodeID.S3WriteAccessPolicy,
            target: RoleNodeID.S3WriteAccessRole,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.PERMISSION_POLICY_ATTACHED_TO_ROLE,
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
  ],
];
