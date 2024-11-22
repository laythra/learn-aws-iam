import { ObjectiveType, BaseFinishEventMap } from '@/machines/types';

export enum NodeCreationFinishEvent {
  USER_NODE_CREATED = 'USER_NODE_CREATED',
}

export enum EdgeConnectionFinishEvent {
  PolicyAttachedToUser = 'POLICY_ATTACHED_TO_USER',
}

export interface FinishEventMap extends BaseFinishEventMap {
  [ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE]: NodeCreationFinishEvent;
  [ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE]: NodeCreationFinishEvent;
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.POLICY_ROLE_EDIT_OBJECTIVE]: NodeCreationFinishEvent;
  [ObjectiveType.LEVEL_OBJECTIVE]: NodeCreationFinishEvent;
}
