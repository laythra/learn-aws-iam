import { GroupNodeID, UserNodeID } from './types/node-ids';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.Alex,
    to: GroupNodeID.AlphaTeam,
    source_handle: HandleID.Right,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Sam,
    to: GroupNodeID.AlphaTeam,
    source_handle: HandleID.Right,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Morgan,
    to: GroupNodeID.AlphaTeam,
    source_handle: HandleID.Right,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Jordan,
    to: GroupNodeID.BetaTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Casey,
    to: GroupNodeID.BetaTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Taylor,
    to: GroupNodeID.BetaTeam,
    source_handle: HandleID.Left,
    target_handle: HandleID.Top,
  },
];
