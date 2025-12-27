import { GroupNodeID, UserNodeID } from './types/node-id-enums';
import { InitialNodeConnection } from '../types/event-types';
import { HandleID } from '@/types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.Mario,
    to: GroupNodeID.PeachTeam,
    source_handle: HandleID.Right,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Luigi,
    to: GroupNodeID.PeachTeam,
    source_handle: HandleID.Right,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Peach,
    to: GroupNodeID.PeachTeam,
    source_handle: HandleID.Right,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Bowser,
    to: GroupNodeID.BowserForce,
    source_handle: HandleID.Left,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Wario,
    to: GroupNodeID.BowserForce,
    source_handle: HandleID.Left,
    target_handle: HandleID.Top,
  },
  {
    from: UserNodeID.Waluigi,
    to: GroupNodeID.BowserForce,
    source_handle: HandleID.Left,
    target_handle: HandleID.Top,
  },
];
