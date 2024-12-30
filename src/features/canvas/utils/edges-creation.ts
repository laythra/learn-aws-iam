import { IAMNodeEntity } from '@/types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

const policyToUserConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.User}`;
const policyToGroupConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.Group}`;
const userToGroupConnectionKey = `${IAMNodeEntity.User}-${IAMNodeEntity.Group}`;
const roleToUserConnectionKey = `${IAMNodeEntity.Role}-${IAMNodeEntity.User}`;

export const edgeConnectionHandlers: Record<string, string> = {
  [policyToUserConnectionKey]: 'ATTACH_POLICY_TO_ENTITY',
  [policyToGroupConnectionKey]: 'ATTACH_POLICY_TO_ENTITY',
  [userToGroupConnectionKey]: 'ATTACH_USER_TO_GROUP',
  [roleToUserConnectionKey]: StatefulStateMachineEvent.AttachRoleToUserNode,
};
