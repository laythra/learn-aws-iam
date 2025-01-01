/** * TODO: Move string event literals from `GenericEventData` inside `src/machines/types/index.ts` to this file.
 */

/**
  * Defines events that are not accompanied by any data, and are used to trigger state machine transitions.
    Can be used from any component to trigger a state machine transition.
  *
*/
export enum StatelessStateMachineEvent {
  IAMNodeContentOpened = 'IAM_NODE_CONTENT_OPENED',
  CreateIAMIdentityTabChanged = 'CREATE_IAM_IDENTITY_TAB_CHANGED',
  CreateIAMPolicyRoleWindowOpened = 'CREATE_IAM_POLICY_ROLE_WINDOW_OPENED',
}

// /**
//  * Defines events that are accompanied by data, and are used to trigger state machine transitions.
//  * Can be used from any component to trigger a state machine transition.
//  */
export enum StatefulStateMachineEvent {
  AddIAMUserGroupNode = 'ADD_IAM_USER_GROUP_NODE',
  AddIAMPolicyNode = 'ADD_IAM_POLICY_NODE',
  ADDIAMRoleNode = 'ADD_IAM_ROLE_NODE',
  AttachRoleToEntity = 'ATTACH_ROLE_TO_ENTITY',
  AttachPolicyToEntity = 'ATTACH_POLICY_TO_ENTITY',
}
