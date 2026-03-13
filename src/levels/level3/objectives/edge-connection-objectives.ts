import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { GroupNodeID, PolicyNodeID } from '../types/node-ids';
import { createEdge } from '@/domain/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/levels/types/objective-types';
import { AccessLevel, HandleID } from '@/types/iam-enums';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.S3ReadWritePolicy,
            target: GroupNodeID.FrontendGroup,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.S3_READ_WRITE_POLICY_CONNECTED,
      is_finished: false,
      established_edge_hovering_label: AccessLevel.Write,
      established_edge_source_handle: HandleID.Top,
      established_edge_target_handle: HandleID.Bottom,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.CloudFrontReadPolicy,
            target: GroupNodeID.FrontendGroup,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.CLOUDFRONT_READ_POLICY_CONNECTED,
      is_finished: false,
      established_edge_hovering_label: AccessLevel.Read,
      established_edge_source_handle: HandleID.Top,
      established_edge_target_handle: HandleID.Bottom,
    },
    {
      type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
      required_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.DynamoDBReadWritePolicy,
            target: GroupNodeID.BackendGroup,
          },
        }),
      ],
      on_finish_event: EdgeConnectionFinishEvent.DYNAMO_DB_READ_WRITE_POLICY_CONNECTED,
      is_finished: false,
      established_edge_hovering_label: AccessLevel.ReadWrite,
      established_edge_source_handle: HandleID.Top,
      established_edge_target_handle: HandleID.Bottom,
    },
  ],
];
