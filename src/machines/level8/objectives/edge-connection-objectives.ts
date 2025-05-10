import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { OUNodeID, SCPNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: SCPNodeID.TutorialSCP,
            target: OUNodeID.Dev,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_SCP_ATTACHED_TO_OU,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'left',
    },
  ],
];
