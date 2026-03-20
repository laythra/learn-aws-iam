import { GroupNodeID, UserNodeID } from './types/node-ids';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.Alex,
    to: GroupNodeID.PaymentsTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Sam,
    to: GroupNodeID.PaymentsTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Casey,
    to: GroupNodeID.AnalyticsTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Taylor,
    to: GroupNodeID.AnalyticsTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Morgan,
    to: GroupNodeID.ComplianceTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Jordan,
    to: GroupNodeID.ComplianceTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
];
