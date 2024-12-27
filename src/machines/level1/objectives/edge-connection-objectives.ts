import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { PolicyNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel } from '@/types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[] = [
  {
    type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
    required_edges: [
      createEdge({ source: PolicyNodeID.S3ReadPolicy, target: UserNodeID.FirstUser }),
    ],
    is_finished: false,
    on_finish_event: EdgeConnectionFinishEvent.PolicyAttachedToUser,
    established_edge_hovering_label: AccessLevel.Read,
    established_edge_target_handle: 'top',
  },
];
