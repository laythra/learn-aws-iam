import _ from 'lodash';

import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { GroupNodeID, PolicyNodeID } from '../types/node-ids';
import { createEdge } from '@/domain/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/types/objective-types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  _.zip(
    [GroupNodeID.PaymentsTeam, GroupNodeID.AnalyticsTeam, GroupNodeID.ComplianceTeam],
    [
      EdgeConnectionFinishEvent.TBAC_POLICY_ATTACHED_GROUP1,
      EdgeConnectionFinishEvent.TBAC_POLICY_ATTACHED_GROUP2,
      EdgeConnectionFinishEvent.TBAC_POLICY_ATTACHED_GROUP3,
    ]
  ).map(
    ([groupId, finishEvent]) =>
      ({
        type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
        required_edges: [
          createEdge({
            rootOverrides: {
              source: PolicyNodeID.TBACPolicy,
              target: groupId!,
            },
          }),
        ],
        on_finish_event: finishEvent,
        is_finished: false,
        established_edge_hovering_label: 'Attached To',
        established_edge_target_handle: 'left',
        established_edge_source_handle: 'top',
      }) as EdgeConnectionObjective<FinishEventMap>
  ),
  _.zip(
    [GroupNodeID.PaymentsTeam, GroupNodeID.AnalyticsTeam, GroupNodeID.ComplianceTeam],
    [
      EdgeConnectionFinishEvent.MANAGE_EC2_POLICY_ATTACHED_GROUP1,
      EdgeConnectionFinishEvent.MANAGE_EC2_POLICY_ATTACHED_GROUP2,
      EdgeConnectionFinishEvent.MANAGE_EC2_POLICY_ATTACHED_GROUP3,
    ]
  ).map(
    ([groupId, finishEvent]) =>
      ({
        type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
        required_edges: [
          createEdge({
            rootOverrides: {
              source: PolicyNodeID.EC2ManagePolicy,
              target: groupId!,
            },
          }),
        ],
        on_finish_event: finishEvent,
        is_finished: false,
        established_edge_hovering_label: 'Attached To',
        established_edge_target_handle: 'left',
        established_edge_source_handle: 'top',
      }) as EdgeConnectionObjective<FinishEventMap>
  ),
];
