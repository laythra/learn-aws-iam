import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { GroupNodeID, PolicyNodeID } from '../types/node-ids';
import { createEdge } from '@/domain/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/types/objective-types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.TBACPolicy,
            target: GroupNodeID.Engineering,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.TBAC_POLICY_ATTACHED,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'left',
      established_edge_source_handle: 'top',
    } as EdgeConnectionObjective<FinishEventMap>,
  ],
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.EC2ManagePolicy,
            target: GroupNodeID.Engineering,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.MANAGE_EC2_POLICY_ATTACHED,
      is_finished: false,
      established_edge_hovering_label: 'Attached To',
      established_edge_target_handle: 'left',
      established_edge_source_handle: 'top',
    } as EdgeConnectionObjective<FinishEventMap>,
  ],
];
