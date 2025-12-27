import { GroupNodeID, UserNodeID } from './types/node-id-enums';
import { InitialNodeConnection } from '@/machines/types/event-types';
import { HandleID } from '@/types/iam-enums';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.Davis,
    to: GroupNodeID.PaymentsTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.John,
    to: GroupNodeID.PaymentsTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Johnson,
    to: GroupNodeID.AnalyticsTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Michael,
    to: GroupNodeID.AnalyticsTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Sarah,
    to: GroupNodeID.ComplianceTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Smith,
    to: GroupNodeID.ComplianceTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
];
