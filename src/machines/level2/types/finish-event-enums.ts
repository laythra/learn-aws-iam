import { BaseFinishEventMap, ObjectiveType } from '@/machines/types';

export enum EdgeConnectionFinishEvent {
  User1AttachedToGroup = 'User1AttachedToGroup',
  User2AttachedToGroup = 'User2AttachedToGroup',
  Policy1AttachedToGroup = 'Policy1AttachedToGroup',
  Policy2AttachedToGroup = 'Policy2AttachedToGroup',
  Policy3AttachedToGroup = 'Policy3AttachedToGroup',
}

export enum UserGroupCreationFinishEvent {
  UserCreated = 'UserCreated',
  GroupCreated = 'GroupCreated',
}

export interface FinishEventMap extends BaseFinishEventMap {
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: never;
  [ObjectiveType.POLICY_EDIT_OBJECTIVE]: never;
  [ObjectiveType.LEVEL_OBJECTIVE]: never;
  [ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE]: UserGroupCreationFinishEvent;
  [ObjectiveType.ROLE_CREATION_OBJECTIVE]: never;
}
