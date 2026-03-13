import { PolicyNodeID, RoleNodeID } from './types/node-ids';

export const INITIAL_TUTORIAL_CONNECTIONS: { from: string; to: string }[] = [
  {
    from: PolicyNodeID.BillingPolicy,
    to: RoleNodeID.FinanceAuditorRole,
  },
];

export const INITIAL_IN_LEVEL_CONNECTIONS: { from: string; to: string }[] =
  INITIAL_TUTORIAL_CONNECTIONS;
