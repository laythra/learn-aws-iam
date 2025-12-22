import { PermissionBoundaryID, UserNodeID } from './types/node-id-enums';
import { InitialNodeConnection } from '../types';
import { HandleID } from '@/types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: PermissionBoundaryID.PermissionBoundary1,
    to: UserNodeID.Sephiroth,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [];
