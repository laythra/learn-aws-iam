import { BaseFinishEventMap, ObjectiveType } from '@/machines/types';

export enum NodeEditFinishEvent {
  DEVELOPER_POLICY_EDITED = 'DEVELOPER_POLICY_EDITED',
  DATA_SCIENTIST_POLICY_EDITED = 'DATA_SCIENTIST_POLICY_EDITED',
  INTERN_POLICY_EDITED = 'INTERN_POLICY_EDITED',
}

export interface FinishEventMap extends BaseFinishEventMap {
  [ObjectiveType.LEVEL_OBJECTIVE]: never;
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: never;
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: never;
  [ObjectiveType.POLICY_EDIT_OBJECTIVE]: NodeEditFinishEvent;
  [ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE]: never;
  [ObjectiveType.ROLE_CREATION_OBJECTIVE]: never;
}
