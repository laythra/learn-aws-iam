import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { OUNodeID, SCPNodeID } from '../types/node-id-enums';
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
      established_edge_source_handle: HandleID.Right,
      established_edge_target_handle: HandleID.Left,
    },
  ],
];
