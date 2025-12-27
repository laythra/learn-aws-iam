import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { GroupNodeID, PolicyNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types/objective-types';
import { AccessLevel } from '@/types/iam-enums';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: UserNodeID.FirstUser, target: GroupNodeID.FirstGroup },
        }),
      ],
      is_finished: false,
      on_finish_event: EdgeConnectionFinishEvent.User1AttachedToGroup,
      established_edge_hovering_label: AccessLevel.Read,
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: PolicyNodeID.PolicyNode1, target: GroupNodeID.FirstGroup },
        }),
      ],
      is_finished: false,
      on_finish_event: EdgeConnectionFinishEvent.Policy1AttachedToGroup,
      established_edge_hovering_label: AccessLevel.Read,
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: PolicyNodeID.PolicyNode2, target: GroupNodeID.FirstGroup },
        }),
      ],
      is_finished: false,
      on_finish_event: EdgeConnectionFinishEvent.Policy2AttachedToGroup,
      established_edge_hovering_label: AccessLevel.Read,
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: PolicyNodeID.PolicyNode3, target: GroupNodeID.FirstGroup },
        }),
      ],
      is_finished: false,
      on_finish_event: EdgeConnectionFinishEvent.Policy3AttachedToGroup,
      established_edge_hovering_label: AccessLevel.Read,
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: UserNodeID.SecondUser, target: GroupNodeID.FirstGroup },
        }),
      ],
      is_finished: false,
      on_finish_event: EdgeConnectionFinishEvent.User2AttachedToGroup,
      established_edge_hovering_label: AccessLevel.Read,
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
  ],
];
