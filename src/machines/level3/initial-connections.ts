import { GroupNodeID, UserNodeID } from './types/node-id-enums';

export const INITIAL_IN_LEVEL_CONNECTIONS: { from: string; to: string }[] = [
  {
    from: UserNodeID.Laith,
    to: GroupNodeID.FrontendGroup,
  },
  {
    from: UserNodeID.Ali,
    to: GroupNodeID.FrontendGroup,
  },
  {
    from: UserNodeID.Mohammad,
    to: GroupNodeID.BackendGroup,
  },
  {
    from: UserNodeID.Khalid,
    to: GroupNodeID.BackendGroup,
  },
];
