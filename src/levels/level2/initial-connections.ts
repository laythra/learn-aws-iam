import { PolicyNodeID, UserNodeID } from './types/node-ids';

export const INITIAL_CONNECTIONS: { from: string; to: string }[] = [
  {
    from: PolicyNodeID.PolicyNode1,
    to: UserNodeID.FirstUser,
  },
  {
    from: PolicyNodeID.PolicyNode2,
    to: UserNodeID.FirstUser,
  },
  {
    from: PolicyNodeID.PolicyNode3,
    to: UserNodeID.FirstUser,
  },
];
