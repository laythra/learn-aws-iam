import { BaseFinishEventMap, ObjectiveType } from '@/machines/types';

export enum RoleCreationFinishEvent {
  DYNAMODB_READ_ROLE_CREATED = 'DYNAMODB_READ_ROLE_CREATED',
}

export enum TrustPolicyEditFinishEvent {
  TUTORIAL_TRUST_POLICY_EDITED = 'TUTORIAL_TRUST_POLICY_EDITED',
}

export enum EdgeConnectionFinishEvent {
  DYNAMODB_READ_POLICY_ATTACHED_TO_READ_ROLE = 'DYNAMODB_READ_POLICY_ATTACHED_TO_READ_ROLE',
  IAM_USER_ATTACHED_TO_DYNAMO_READ_ROLE = 'IAM_USER_ATTACHED_TO_DYNAMO_READ_ROLE',
  ASSUME_ROLE_POLICY_ATTACHED_TO_IAM_USER = 'ASSUME_ROLE_POLICY_ATTACHED_TO_IAM_USER',
}

export enum PolicyCreationFinishEvent {
  DYNAMODB_READ_POLICY_CREATED = 'DYNAMODB_READ_POLICY_CREATED',
  ASSUME_ROLE_POLICY_CREATED = 'ASSUME_ROLE_POLICY_CREATED',
}

export interface FinishEventMap extends BaseFinishEventMap {
  [ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE]: never;
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: PolicyCreationFinishEvent;
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.POLICY_EDIT_OBJECTIVE]: never;
  [ObjectiveType.LEVEL_OBJECTIVE]: never;
  [ObjectiveType.ROLE_CREATION_OBJECTIVE]: RoleCreationFinishEvent;
  [ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE]: TrustPolicyEditFinishEvent;
}
