import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { PolicyNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.Policy1,
            target: UserNodeID.Sephiroth,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_POLICY1_ATTACHED_TO_USER,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'bottom',
      established_edge_source_handle: 'top',
    },
  ],
];
