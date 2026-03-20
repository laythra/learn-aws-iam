import {
  AccountID,
  GroupNodeID,
  OUNodeID,
  PolicyNodeID,
  SCPNodeID,
  UserNodeID,
} from './types/node-ids';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

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
    to: GroupNodeID.TutorialProdTeamGroup,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.TutorialStagingCloudTrailAccess,
    to: GroupNodeID.TutorialStagingTeamGroup,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: SCPNodeID.DefaultSCP,
    to: OUNodeID.TutorialOU,
    source_handle: HandleID.Left,
    target_handle: HandleID.Right,
  },
  ...[UserNodeID.TutorialJordan, UserNodeID.TutorialCasey, UserNodeID.TutorialTaylor].map(id => ({
    from: id,
    to: GroupNodeID.TutorialStagingTeamGroup,
    source_handle: HandleID.Right,
    target_handle: HandleID.Left,
  })),
  ...[UserNodeID.TutorialAlex, UserNodeID.TutorialSam, UserNodeID.TutorialMorgan].map(id => ({
    from: id,
    to: GroupNodeID.TutorialProdTeamGroup,
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
  ...[UserNodeID.Robin, UserNodeID.Riley].map(id => ({
    from: id,
    to: GroupNodeID.InLevelNotificationsTeamGroup,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  })),
  ...[UserNodeID.Blake, UserNodeID.Quinn].map(id => ({
    from: id,
    to: GroupNodeID.InLevelSearchTeamGroup,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  })),
  ...[UserNodeID.Casey, UserNodeID.Taylor].map(id => ({
    from: id,
    to: GroupNodeID.InLevelPaymentsTeamGroup,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  })),
];
