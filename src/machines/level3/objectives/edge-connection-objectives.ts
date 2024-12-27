import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { GroupNodeID, PolicyNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel } from '@/types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({ source: PolicyNodeID.S3ReadWriteAcces, target: GroupNodeID.FrontendGroup }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.S3_READ_WRITE_POLICY_CONNECTED,
      is_finished: false,
      established_edge_hovering_label: AccessLevel.Write,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: PolicyNodeID.CloudfrontReadAccess,
          target: GroupNodeID.FrontendGroup,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.CLOUDFRONT_READ_POLICY_CONNECTED,
      is_finished: false,
      established_edge_hovering_label: AccessLevel.Read,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          source: PolicyNodeID.DynamoDBReadWriteAccess,
          target: GroupNodeID.BackendGroup,
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.DYNAMO_DB_READ_WRITE_POLICY_CONNECTED,
      is_finished: false,
      established_edge_hovering_label: AccessLevel.ReadWrite,
    },
  ],
];
