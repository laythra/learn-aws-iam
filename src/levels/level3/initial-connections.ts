import { GroupNodeID, UserNodeID } from './types/node-ids';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.Alex,
    to: GroupNodeID.FrontendGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Left,
  },
  {
    from: UserNodeID.Sam,
    to: GroupNodeID.FrontendGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Left,
  },
  {
    from: UserNodeID.Morgan,
    to: GroupNodeID.BackendGroup,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Jordan,
    to: GroupNodeID.BackendGroup,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
];
