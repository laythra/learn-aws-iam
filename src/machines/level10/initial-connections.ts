import { GroupNodeID, UserNodeID } from './types/node-id-enums';
import { InitialNodeConnection } from '../types';
import { HandleID } from '@/types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.Davis,
    to: GroupNodeID.PaymentsTeam,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.John,
    to: GroupNodeID.PaymentsTeam,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.Johnson,
    to: GroupNodeID.AnalyticsTeam,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.Michael,
    to: GroupNodeID.AnalyticsTeam,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.Sarah,
    to: GroupNodeID.ComplianceTeam,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.Smith,
    to: GroupNodeID.ComplianceTeam,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
];
