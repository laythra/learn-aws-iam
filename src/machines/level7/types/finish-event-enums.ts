import { FinishEventMapWithDefaults, ObjectiveType } from '@/machines/types';

export enum EdgeConnectionFinishEvent {
  IDENTITY_POLICY_ATTACHED_TO_IAM_USER = 'IDENTITY_POLICY_ATTACHED_TO_IAM_USER',
}

export enum PolicyCreationFinishEvent {
  TUTORIAL_RESOURCE_BASED_POLICY_CREATED = 'TUTORIAL_RESOURCE_BASED_POLICY_CREATED',
  IN_LEVEL_RESOURCE_BASED_POLICY_CREATED = 'IN_LEVEL_RESOURCE_BASED_POLICY_CREATED',
  IN_LEVEL_IDENTITY_POLICY_CREATED = 'IN_LEVEL_IDENTITY_POLICY_CREATED',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: PolicyCreationFinishEvent;
}>;
