/**
 * Defines events that are not accompanied by any data, and are used to trigger state machine transitions.
 * * Can be used from any component to trigger a state machine transition.
 *
 */
export enum VoidEvent {
  IAMNodeContentOpened = 'IAM_NODE_CONTENT_OPENED',
  IAMNodeContentClosed = 'IAM_NODE_CONTENT_CLOSED',
  IAMNodeARNOpened = 'IAM_NODE_ARN_OPENED',
  CreateIAMIdentityTabChanged = 'CREATE_IAM_IDENTITY_TAB_CHANGED',
  CreateIAMIdentityPopupOpened = 'CREATE_IAM_IDENTITY_POPUP_OPENED',
  IAMNodeARNCopied = 'IAM_NODE_ARN_COPIED',
  IAMNodeTagsOpened = 'IAM_NODE_TAGS_OPENED',
  IAMNodeTagsPopoverClosed = 'IAM_NODE_TAGS_POPOVER_CLOSED',
  HidePopovers = 'HIDE_POPOVERS',
  SidePanelOpened = 'SIDE_PANEL_OPENED',
  HideFixedPopover = 'HIDE_FIXED_POPOVERS',
  NextPopover = 'NEXT_POPOVER',
  NextPopup = 'NEXT_POPUP',
  NextFixedPopover = 'NEXT_FIXED_POPOVER',
  ToggleSidePanel = 'TOGGLE_SIDE_PANEL',
}

// /**
//  * Defines events that are accompanied by data, and are used to trigger state machine transitions.
//  * Can be used from any component to trigger a state machine transition.
//  */
export enum DataEvent {
  AddIAMUserGroupNode = 'ADD_IAM_USER_GROUP_NODE',
  AddIAMNode = 'ADD_IAM_POLICY_NODE',
  EditIAMIdentityPolicyNode = 'EDIT_IAM_IDENTITY_POLICY_NODE',
  ConnectNodes = 'CONNECT_NODES',
  DeleteEdge = 'DELETE_EDGE',
  DeleteEdges = 'DELETE_EDGES',
  DeleteNode = 'DELETE_NODE',
  EditNodeMetadata = 'EDIT_NODE_METADATA',
  LogAnalyticsEvent = 'LOG_ANALYTICS_EVENT',
}
