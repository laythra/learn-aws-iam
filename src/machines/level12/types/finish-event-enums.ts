import { FinishEventMapWithDefaults, ObjectiveType } from '@/machines/types';

export enum EdgeConnectionFinishEvent {
  COULDTRAIL_SCP_CONNECTED = 'COULDTRAIL_SCP_CONNECTED',
}

export enum PolicyCreationFinishEvent {
  ACCESS_DELEGATION_POLICY_CREATED = 'ACCESS_DELEGATION_POLICY_CREATED',
}

export enum PermissionBoundaryCreationFinishEvent {
  READ_SECRETS_PERMISSION_BOUNDARY_CREATED = 'READ_SECRETS_PERMISSION_BOUNDARY_CREATED',
}

export enum SCPCreationFinishEvent {
  BLOCK_CLOUDTRAIL_DELE1TION_SCP_CREATED = 'BLOCK_CLOUDTRAIL_DELETION_SCP_CREATED',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: PolicyCreationFinishEvent;
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE]: PermissionBoundaryCreationFinishEvent;
  [ObjectiveType.SCP_CREATION_OBJECTIVE]: SCPCreationFinishEvent;
}>;
