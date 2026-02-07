import { FinishEventMapWithDefaults, ObjectiveType } from '@/levels/types/objective-types';

export enum NodeCreationFinishEvent {
  USER_NODE_CREATED = 'USER_NODE_CREATED',
}

export enum EdgeConnectionFinishEvent {
  PolicyAttachedToTutorialUser = 'POLICY_ATTACHED_TO_TUTORIAL_USER',
  PolicyAttachedToCreatedUser = 'POLICY_ATTACHED_TO_CREATED_USER',
}

export type FinishEventMap = FinishEventMapWithDefaults<{
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: EdgeConnectionFinishEvent;
  [ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE]: NodeCreationFinishEvent;
}>;
