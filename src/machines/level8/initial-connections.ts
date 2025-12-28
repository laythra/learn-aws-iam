import { PolicyNodeID, RoleNodeID, UserNodeID } from './types/node-id-enums';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.JuniorBruce,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.JuniorClark,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.SeniorWayne,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.SeniorKent,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.SlackServiceManagePolicy,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
];
