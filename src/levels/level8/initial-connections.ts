import { PolicyNodeID, RoleNodeID, UserNodeID } from './types/node-ids';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: UserNodeID.JuniorAlex,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.JuniorMorgan,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.SeniorSam,
    to: RoleNodeID.SlackCodeDeployRole,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: UserNodeID.SeniorJordan,
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
