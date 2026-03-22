import { FinishEventMapWithDefaults, ObjectiveType } from '@/types/objective-types';

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

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE]: UserGroupCreationFinishEvent;
}>;
