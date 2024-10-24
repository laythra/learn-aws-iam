import { PolicyNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import type { EdgeConnectionObjective } from '@/machines/types';

export enum EdgeConnectionFinishEvent {
  DEVELOPER_POLICY_CONNECTED = 'DEVELOPER_POLICY_CONNECTED',
}

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective[][] = [
  [
    {
      required_edges: [
        createEdge({ source: PolicyNodeID.DeveloperPolicy, target: UserNodeID.Developer1 }),
      ],
      locked_edges: [],
      on_finish_event: EdgeConnectionFinishEvent.DEVELOPER_POLICY_CONNECTED,
      is_finished: false,
    },
  ],
];
