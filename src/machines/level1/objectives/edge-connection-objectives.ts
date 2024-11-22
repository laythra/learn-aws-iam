import { EdgeConnectionFinishEvent, FinishEventMap } from '../types/finish-event-enums';
import { ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective, ObjectiveType } from '@/machines/types';

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective<FinishEventMap>[] = [
  {
    type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE,
    required_edges: [
      createEdge({ source: UserNodeID.FirstUser, target: ResourceNodeID.PublicImagesS3Bucket }),
    ],
    is_finished: false,
    on_finish_event: EdgeConnectionFinishEvent.PolicyAttachedToUser,
  },
];
