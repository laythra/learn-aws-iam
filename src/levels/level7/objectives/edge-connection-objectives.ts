import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { PolicyNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/levels/types/objective-types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.InsideLevelIdentityBasedPolicy,
            target: UserNodeID.InsideLevelUser,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.IDENTITY_POLICY_ATTACHED_TO_IAM_USER,
      is_finished: false,
      established_edge_hovering_label: 'Attached to',
      established_edge_target_handle: 'bottom',
    },
  ],
];
