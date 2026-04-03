import { FinishEventMapWithDefaults, ObjectiveType } from '@/types/objective-types';

export enum EdgeConnectionFinishEvent {
  TBAC_POLICY_ATTACHED = 'TBAC_POLICY_ATTACHED',
  MANAGE_EC2_POLICY_ATTACHED = 'MANAGE_EC2_POLICY_ATTACHED',
}

export enum PolicyCreationFinishEvent {
  ALLOW_CREATE_EC2_WITH_TAGS_POLICY_CREATED = 'ALLOW_CREATE_EC2_WITH_TAGS_POLICY_CREATED',
  MANAGE_EC2_POLICY_CREATED = 'MANAGE_EC2_POLICY_CREATED',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: PolicyCreationFinishEvent;
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
}>;
