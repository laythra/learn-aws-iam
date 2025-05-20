import { FinishEventMapWithDefaults, ObjectiveType } from '@/machines/types';

export enum EdgeConnectionFinishEvent {
  TUTORIAL_SCP_ATTACHED_TO_OU = 'TUTORIAL_SCP_ATTACHED_TO_OU',
}

export enum PolicyCreationFinishEvent {
  TUTORIAL_RESOURCE_BASED_POLICY_CREATED = 'TUTORIAL_RESOURCE_BASED_POLICY_CREATED',
  IN_LEVEL_RESOURCE_BASED_POLICY_CREATED = 'IN_LEVEL_RESOURCE_BASED_POLICY_CREATED',
  IN_LEVEL_IDENTITY_POLICY_CREATED = 'IN_LEVEL_IDENTITY_POLICY_CREATED',
}

export enum SCPCreationFInishEvent {
  TUTORIAL_SCP_CREATED = 'TUTORIAL_SCP_CREATED',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: PolicyCreationFinishEvent;
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.SCP_CREATION_OBJECTIVE]: SCPCreationFInishEvent;
}>;
