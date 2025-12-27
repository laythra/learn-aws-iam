import { GroupNodeID, UserNodeID } from './types/node-id-enums';
import { InitialNodeConnection } from '../types/event-types';
import { HandleID } from '@/types/iam-enums';

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.Laith,
    to: GroupNodeID.FrontendGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Left,
  },
  {
    from: UserNodeID.Ali,
    to: GroupNodeID.FrontendGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Left,
  },
  {
    from: UserNodeID.Mohammad,
    to: GroupNodeID.BackendGroup,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.Khalid,
    to: GroupNodeID.BackendGroup,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
];
