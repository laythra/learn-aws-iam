import { PolicyNodeID, RoleNodeID } from './types/node-ids';
import { HandleID } from '@/types/iam-enums';
import { InitialNodeConnection } from '@/types/iam-node-types';

export const INITIAL_TUTORIAL_CONNECTIONS: InitialNodeConnection[] = [
  {
    from: PolicyNodeID.BillingPolicy,
    to: RoleNodeID.FinanceAuditorRole,
    source_handle: HandleID.Bottom,
    target_handle: HandleID.Top,
  },
];

export const INITIAL_IN_LEVEL_CONNECTIONS: InitialNodeConnection[] = INITIAL_TUTORIAL_CONNECTIONS;
