import { FinishEventMapWithDefaults, ObjectiveType } from '@/machines/types';

export enum EdgeConnectionFinishEvent {
  TUTORIAL_POLICY1_ATTACHED_TO_USER = 'TUTORIAL_POLICY1_ATTACHED_TO_USER',
}

export enum PolicyCreationFinishEvent {
  ACCESS_DELEGATION_POLICY_CREATED = 'ACCESS_DELEGATION_POLICY_CREATED',
}

export enum PermissionBoundaryCreationFinishEvent {
  READ_SECRETS_PERMISSION_BOUNDARY_CREATED = 'READ_SECRETS_PERMISSION_BOUNDARY_CREATED',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: PolicyCreationFinishEvent;
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE]: PermissionBoundaryCreationFinishEvent;
}>;
