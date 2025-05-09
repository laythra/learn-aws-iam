import { BaseFinishEventMap, ObjectiveType } from '@/machines/types';

export enum NodeCreationFinishEvent {
  USER_NODE_CREATED = 'USER_NODE_CREATED',
}

export enum EdgeConnectionFinishEvent {
  PolicyAttachedToTutorialUser = 'POLICY_ATTACHED_TO_TUTORIAL_USER',
  PolicyAttachedToCreatedUser = 'POLICY_ATTACHED_TO_CREATED_USER',
}

export interface FinishEventMap extends BaseFinishEventMap {
  [ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE]: NodeCreationFinishEvent;
  [ObjectiveType.POLICY_CREATION_OBJECTIVE]: never;
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.POLICY_EDIT_OBJECTIVE]: never;
  [ObjectiveType.LEVEL_OBJECTIVE]: never;
  [ObjectiveType.ROLE_CREATION_OBJECTIVE]: never;
  [ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE]: never;
  [ObjectiveType.SCP_CREATION_OBJECTIVE]: never;
}
