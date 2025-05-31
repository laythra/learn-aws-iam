import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { AccountNodeID, PolicyNodeID, SCPNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.TutorialEC2TerminatePolicy,
            target: UserNodeID.James,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_POLICY_CONNECTED_TO_USER1,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'left',
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.TutorialEC2TerminatePolicy,
            target: UserNodeID.Bond,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TUTORIAL_POLICY_CONNECTED_TO_USER2,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'left',
    },
  ],
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: SCPNodeID.InLevelAccountSCP,
            target: AccountNodeID.Staging,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.IN_LEVEL_SCP_ATTACHED_TO_OU,
      is_finished: false,

      // TODO: Do we need established_edge_hovering_label and established_edge_target_handle
      // if we can define this at the required_edges key level?
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'top',
      established_edge_source_handle: 'bottom',
    },
  ],
];
