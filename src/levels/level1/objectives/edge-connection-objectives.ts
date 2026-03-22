import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { PolicyNodeID, UserNodeID } from '../types/node-ids';
import { createEdge } from '@/domain/edge-factory';
import { AccessLevel } from '@/types/iam-enums';
import { EdgeConnectionObjective, ObjectiveType } from '@/types/objective-types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: PolicyNodeID.S3ReadPolicy, target: UserNodeID.TutorialUser },
        }),
      ],
      is_finished: false,
      on_finish_event: EdgeConnectionFinishEvent.PolicyAttachedToTutorialUser,
      established_edge_hovering_label: AccessLevel.Read,
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
  ],
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: { source: PolicyNodeID.S3ReadPolicy, target: UserNodeID.FirstUser },
        }),
      ],
      is_finished: false,
      on_finish_event: EdgeConnectionFinishEvent.PolicyAttachedToCreatedUser,
      established_edge_hovering_label: AccessLevel.Read,
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
  ],
];
