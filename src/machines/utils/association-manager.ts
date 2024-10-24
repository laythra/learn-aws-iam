import { produce } from 'immer';
import { Node } from 'reactflow';

import { IAMPolicyNodeData, IAMUserNodeData } from '@/types';

/**
 * Attaches policies to users based on predefined associations.
 * Uses immer to manage immutability in a concise way.
 *
 * @template TUserID - The enum representing the user node ID.
 * @template TPolicyID - The enum representing the policy node ID.
 * @param users - The list of user nodes.
 * @param associations - The predefined associations between users and policies,
 * where the key is a user ID, and the value is the list of policy IDs to attach.
 * @returns The updated list of user nodes with associated policies.
 */
export const attachPoliciesToUsers = <TUserID extends string, TPolicyID extends string>(
  users: Node<IAMUserNodeData>[],
  associations: Record<TUserID, TPolicyID[]>
): Node<IAMUserNodeData>[] => {
  return produce(users, draft => {
    draft.forEach(user => {
      user.data.associated_policies = associations[user.data.id as TUserID] || [];
    });
  });
};

/**
 * Attaches users to policies based on predefined associations.
 * Uses immer to manage immutability in a concise way.
 *
 * @template TUserID - The enum representing the user node ID.
 * @template TPolicyID - The enum representing the policy node ID.
 * @param users - The list of user nodes.
 * @param associations - The predefined associations between policies and users,
 * the key is the policy ID and the value is the list of the user IDs we want to attach.
 * @returns The updated list of policy nodes with associated users.
 */
export const attachUsersToPolicies = <TUserID extends string, TPolicyID extends string>(
  policies: Node<IAMPolicyNodeData>[],
  associations: Record<TPolicyID, TUserID[]>
): Node<IAMPolicyNodeData>[] => {
  return produce(policies, draft => {
    draft.forEach(policy => {
      policy.data.associated_users = associations[policy.data.id as TPolicyID] || [];
    });
  });
};
