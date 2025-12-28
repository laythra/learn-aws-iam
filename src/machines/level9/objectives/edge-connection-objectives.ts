import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { GroupNodeID, PolicyNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types/objective-types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.RDSManagePolicy1,
            target: GroupNodeID.PeachTeam,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.RDS1_MANAGE_POLICY_ATTACHED_GROUP1,
      is_finished: false,
      established_edge_hovering_label: 'Belongs To',
      established_edge_target_handle: 'top',
      established_edge_source_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.RDSManagePolicy2,
            target: GroupNodeID.BowserForce,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.RDS2_MANAGE_POLICY_ATTACHED_GROUP2,
      is_finished: false,
      established_edge_hovering_label: 'Attahced To',
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
            source: PolicyNodeID.RDSSharedPolicy,
            target: GroupNodeID.PeachTeam,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.RDS_SHARED_MANAGE_POLICY_ATTACHED_GROUP1,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'top',
      established_edge_source_handle: 'bottom',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.RDSSharedPolicy,
            target: GroupNodeID.BowserForce,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.RDS_SHARED_MANAGE_POLICY_ATTACHED_GROUP2,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'top',
      established_edge_source_handle: 'bottom',
    },
  ],
];
