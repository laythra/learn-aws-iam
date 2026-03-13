import { PolicyNodeID, UserNodeID } from './types/node-ids';

export const INITIAL_TUTORIAL_CONNECTIONS: { from: string; to: string }[] = [
  {
    from: PolicyNodeID.DeveloperPolicy,
    to: UserNodeID.Developer1,
  },
  {
    from: PolicyNodeID.DeveloperPolicy,
    to: UserNodeID.Developer2,
  },
  {
    from: PolicyNodeID.DataScientistPolicy,
    to: UserNodeID.DataScientist1,
  },
  {
    from: PolicyNodeID.InternPolicy,
    to: UserNodeID.Intern1,
  },
  {
    from: PolicyNodeID.InternPolicy,
    to: UserNodeID.Intern2,
  },
];

export const INITIAL_IN_LEVEL_CONNECTIONS: { from: string; to: string }[] =
  INITIAL_TUTORIAL_CONNECTIONS;
