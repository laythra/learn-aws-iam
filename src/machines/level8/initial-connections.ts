import {
  AccountNodeID,
  OUNodeID,
  PolicyNodeID,
  ResourceNodeID,
  ResourcePolicyNodeID,
  SCPNodeID,
  UserNodeID,
} from './types/node-id-enums';
import { InitialNodeConnection } from '../types';
import { HandleID } from '@/types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: OUNodeID.Dev,
    to: AccountNodeID.Dev,
    source_handle: HandleID.Bottom,
    target_handle: HandleID.Top,
  },
  {
    from: PolicyNodeID.TutorialS3ReadPolicy,
    to: UserNodeID.TutorialFirstUser,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: OUNodeID.Dev,
    to: AccountNodeID.Staging,
    source_handle: HandleID.Bottom,
    target_handle: HandleID.Top,
  },
  {
    from: OUNodeID.Dev,
    to: AccountNodeID.Prod,
    source_handle: HandleID.Bottom,
    target_handle: HandleID.Top,
  },
  {
    from: ResourcePolicyNodeID.InLevelResourceBasedPolicy,
    to: ResourceNodeID.InLevelSecret1,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.InsideLevelUser1,
    to: ResourceNodeID.InLevelSecret1,
    source_handle: HandleID.Top,
    target_handle: HandleID.Right,
  },
  {
    from: UserNodeID.InsideLevelUser2,
    to: ResourceNodeID.InLevelSecret1,
    source_handle: HandleID.Top,
    target_handle: HandleID.Right,
  },
  {
    from: PolicyNodeID.InLevelPermissionPolicy,
    to: UserNodeID.InsideLevelUser3,
    source_handle: HandleID.Right,
    target_handle: HandleID.Left,
  },
  {
    from: PolicyNodeID.InLevelPermissionPolicy,
    to: UserNodeID.InsideLevelUser4,
    source_handle: HandleID.Right,
    target_handle: HandleID.Left,
  },
  {
    from: SCPNodeID.InLevelOUSCP,
    to: OUNodeID.Dev,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
];
