import { FinishEventMapWithDefaults, ObjectiveType } from '@/machines/types';

// TODO: Rename to PolicyEditFinishEvent instead
export enum NodeEditFinishEvent {
  DEVELOPER_POLICY_EDITED = 'DEVELOPER_POLICY_EDITED',
  DATA_SCIENTIST_POLICY_EDITED = 'DATA_SCIENTIST_POLICY_EDITED',
  INTERN_POLICY_EDITED = 'INTERN_POLICY_EDITED',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.POLICY_EDIT_OBJECTIVE]: NodeEditFinishEvent;
}>;
