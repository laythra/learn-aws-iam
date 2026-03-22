import { FinishEventMapWithDefaults, ObjectiveType } from '@/types/objective-types';

export enum PolicyEditFinishEvent {
  SLACK_SERVICE_MANAGE_POLICY_EDITED_FIRST_TIME = 'SLACK_SERVICE_MANAGE_POLICY_EDITED_FIRST_TIME',
  SLACK_SERVICE_MANAGE_POLICY_EDITED_SECOND_TIME = 'SLACK_SERVICE_MANAGE_POLICY_EDITED_SECOND_TIME',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.POLICY_EDIT_OBJECTIVE]: PolicyEditFinishEvent;
}>;
