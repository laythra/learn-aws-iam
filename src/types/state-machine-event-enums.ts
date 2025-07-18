/** * TODO: Move string event literals from `GenericEventData` inside `src/machines/types/index.ts` to this file.
 */

/**
 * Defines events that are not accompanied by any data, and are used to trigger state machine transitions.
 * * Can be used from any component to trigger a state machine transition.
 *
 */
export enum StatelessStateMachineEvent {
  IAMNodeContentOpened = 'IAM_NODE_CONTENT_OPENED',
  IAMNodeContentClosed = 'IAM_NODE_CONTENT_CLOSED',
  IAMNodeARNOpened = 'IAM_NODE_ARN_OPENED',
  CreateIAMIdentityTabChanged = 'CREATE_IAM_IDENTITY_TAB_CHANGED',
  CreateIAMPolicyRoleWindowOpened = 'CREATE_IAM_POLICY_ROLE_WINDOW_OPENED',
  CreateIAMIdentityPopupOpened = 'CREATE_IAM_IDENTITY_POPUP_OPENED',
  IAMNodeARNCopied = 'IAM_NODE_ARN_COPIED',
  IAMNodeTagsOpened = 'IAM_NODE_TAGS_OPENED',
  IAMNodeTutorialPopoverClosed = 'IAM_NODE_TUTORIAL_POPOVER_CLOSED',
  IAMNodeTagsPopoverClosed = 'IAM_NODE_TAGS_POPOVER_CLOSED',
  HidePopovers = 'HIDE_POPOVERS',
  HideHelpPopover = 'HIDE_HELP_POPOVER',
  ShowHelpPopover = 'SHOW_HELP_POPOVER',
  SidePanelOpened = 'SIDE_PANEL_OPENED',
}

// /**
//  * Defines events that are accompanied by data, and are used to trigger state machine transitions.
//  * Can be used from any component to trigger a state machine transition.
//  */
export enum StatefulStateMachineEvent {
  AddIAMUserGroupNode = 'ADD_IAM_USER_GROUP_NODE',
  AddIAMPolicyNode = 'ADD_IAM_POLICY_NODE',
  AddIAMResourcePolicyNode = 'ADD_IAM_RESOURCE_POLICY_NODE',
  ADDIAMRoleNode = 'ADD_IAM_ROLE_NODE',
  AddIAMSCPNode = 'ADD_IAM_SCP_NODE',
  EditIAMPolicyNode = 'EDIT_IAM_POLICY_NODE',
  AttachRoleToEntity = 'ATTACH_ROLE_TO_ENTITY',
  AttachPolicyToEntity = 'ATTACH_POLICY_TO_ENTITY',
  ConnectNodes = 'CONNECT_NODES',
  DeleteEdge = 'DELETE_EDGE',
  DeleteNode = 'DELETE_NODE',
}
