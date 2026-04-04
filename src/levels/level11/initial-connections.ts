import { PermissionBoundaryID, PolicyNodeID, UserNodeID } from './types/node-ids';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: PermissionBoundaryID.PermissionBoundary1,
    to: UserNodeID.Alex,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  ...[UserNodeID.Jordan, UserNodeID.Morgan, UserNodeID.Sam].map(id => ({
    from: PolicyNodeID.AssumeRolePolicy,
    to: id,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  })),
];
