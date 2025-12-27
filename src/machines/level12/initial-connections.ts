import {
  AccountID,
  GroupNodeID,
  OUNodeID,
  PolicyNodeID,
  SCPNodeID,
  UserNodeID,
} from './types/node-id-enums';
import { InitialNodeConnection } from '../types/event-types';
import { HandleID } from '@/types/iam-enums';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: OUNodeID.TutorialOU,
    to: AccountID.TutorialProdAccount,
    source_handle: HandleID.Bottom,
    target_handle: HandleID.Top,
  },
  {
    from: OUNodeID.TutorialOU,
    to: AccountID.TutorialStagingAccount,
    source_handle: HandleID.Bottom,
    target_handle: HandleID.Top,
  },
  {
    from: PolicyNodeID.TutorialProdCloudTrailAccess,
    to: GroupNodeID.TutorialEldianGroup,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.TutorialStagingCloudTrailAccess,
    to: GroupNodeID.TutorialMarleyGroup,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: SCPNodeID.DefaultSCP,
    to: OUNodeID.TutorialOU,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  ...[UserNodeID.Reiner, UserNodeID.Bertolt, UserNodeID.Annie].map(id => ({
    from: id,
    to: GroupNodeID.TutorialMarleyGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Left,
  })),
  ...[UserNodeID.Eren, UserNodeID.Mikasa, UserNodeID.Armin].map(id => ({
    from: id,
    to: GroupNodeID.TutorialEldianGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Left,
  })),
];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  ...[AccountID.InLevelStagingAccount, AccountID.InLevelProdAccount].map(id => ({
    from: OUNodeID.InLevelOU,
    to: id,
    source_handle: HandleID.Bottom,
    target_handle: HandleID.Top,
  })),
  ...[UserNodeID.Salma, UserNodeID.Tareq].map(id => ({
    from: id,
    to: GroupNodeID.InLevelNotificationsTeamGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Bottom,
  })),
  ...[UserNodeID.Karim, UserNodeID.Yasmin].map(id => ({
    from: id,
    to: GroupNodeID.InLevelSearchTeamGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Bottom,
  })),
  ...[UserNodeID.Omar, UserNodeID.Rania].map(id => ({
    from: id,
    to: GroupNodeID.InLevelPaymentsTeamGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Bottom,
  })),
];
