import { FinishEventMapWithDefaults, ObjectiveType } from '@/types/objective-types';

export enum PolicyEditFinishEvent {
  DEVELOPER_POLICY_EDITED = 'DEVELOPER_POLICY_EDITED',
  DATA_SCIENTIST_POLICY_EDITED = 'DATA_SCIENTIST_POLICY_EDITED',
  INTERN_POLICY_EDITED = 'INTERN_POLICY_EDITED',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.POLICY_EDIT_OBJECTIVE]: PolicyEditFinishEvent;
}>;
