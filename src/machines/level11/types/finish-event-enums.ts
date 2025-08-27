import { FinishEventMapWithDefaults, ObjectiveType } from '@/machines/types';

export enum EdgeConnectionFinishEvent {
  TUTORIAL_POLICY1_ATTACHED_TO_USER = 'TUTORIAL_POLICY1_ATTACHED_TO_USER',
}

export enum PolicyCreationFinishEvent {
  ALLOW_CREATE_RDS_WITH_TAGS_POLICY_CREATED = 'ALLOW_CREATE_RDS_WITH_TAGS_POLICY_CREATED',
  MANAGE_RDS_POLICY_CREATED = 'MANAGE_RDS_POLICY_CREATED',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: PolicyCreationFinishEvent;
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
}>;
