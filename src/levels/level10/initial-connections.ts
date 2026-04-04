import { GroupNodeID, UserNodeID } from './types/node-ids';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.Alex,
    to: GroupNodeID.Engineering,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Sam,
    to: GroupNodeID.Engineering,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Casey,
    to: GroupNodeID.Engineering,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Taylor,
    to: GroupNodeID.Engineering,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Morgan,
    to: GroupNodeID.Engineering,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Jordan,
    to: GroupNodeID.Engineering,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
];
