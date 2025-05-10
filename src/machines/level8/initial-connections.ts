import { AccountNodeID, OUNodeID, PolicyNodeID, UserNodeID } from './types/node-id-enums';
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

export const INITIAL_IN_LEVEL_CONNECTIONS: { from: string; to: string }[] =
  INITIAL_TUTORIAL_CONNECTIONS;
