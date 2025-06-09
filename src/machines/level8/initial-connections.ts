import { PolicyNodeID, RoleNodeID, UserNodeID } from './types/node-id-enums';
import { InitialNodeConnection } from '../types';
import { HandleID } from '@/types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.JuniorBruce,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.JuniorClark,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.SeniorWayne,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.SeniorKent,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: PolicyNodeID.SlackServiceManagePolicy,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
];
