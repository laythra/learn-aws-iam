import { IAMNodeEntity } from '@/types';

const policyToUserConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.User}`;
const policyToGroupConnectionKey = `${IAMNodeEntity.Policy}-${IAMNodeEntity.Group}`;
const userToGroupConnectionKey = `${IAMNodeEntity.User}-${IAMNodeEntity.Group}`;

export const edgeConnectionHandlers: Record<string, string> = {
  [policyToUserConnectionKey]: 'ATTACH_POLICY_TO_ENTITY',
  [policyToGroupConnectionKey]: 'ATTACH_POLICY_TO_ENTITY',
  [userToGroupConnectionKey]: 'ATTACH_USER_TO_GROUP',
};
