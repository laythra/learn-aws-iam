import { PolicyNodeID, UserNodeID } from './types/node-ids';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: PolicyNodeID.SlackCodeDeployPolicy,
    to: UserNodeID.JuniorAlex,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.SlackCodeDeployPolicy,
    to: UserNodeID.JuniorMorgan,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.SlackCodeDeployPolicy,
    to: UserNodeID.SeniorSam,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.SlackCodeDeployPolicy,
    to: UserNodeID.SeniorJordan,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.SlackSecretsAccessPolicy,
    to: UserNodeID.JuniorAlex,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.SlackSecretsAccessPolicy,
    to: UserNodeID.JuniorMorgan,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.SlackSecretsAccessPolicy,
    to: UserNodeID.SeniorSam,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
  {
    from: PolicyNodeID.SlackSecretsAccessPolicy,
    to: UserNodeID.SeniorJordan,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
];
