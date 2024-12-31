import { IAMNodeEntity } from '@/types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

const policyToUserConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.User}`;
const policyToGroupConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.Group}`;
const userToGroupConnectionKey = `${IAMNodeEntity.User}-${IAMNodeEntity.Group}`;
const roleToUserConnectionKey = `${IAMNodeEntity.Role}-${IAMNodeEntity.User}`;
const policyToRoleConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.Role}`;

export const edgeConnectionHandlers: Record<string, string> = {
  [policyToUserConnectionKey]: StatefulStateMachineEvent.AttachPolicyToEntity,
  [policyToGroupConnectionKey]: StatefulStateMachineEvent.AttachPolicyToEntity,
  [userToGroupConnectionKey]: 'ATTACH_USER_TO_GROUP',
  [roleToUserConnectionKey]: StatefulStateMachineEvent.AttachRoleToUserNode,
  [policyToRoleConnectionKey]: StatefulStateMachineEvent.AttachPolicyToEntity,
};
