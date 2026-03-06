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
  CreateIAMIdentityPopupOpened = 'CREATE_IAM_IDENTITY_POPUP_OPENED',
  IAMNodeARNCopied = 'IAM_NODE_ARN_COPIED',
  IAMNodeTagsOpened = 'IAM_NODE_TAGS_OPENED',
  IAMNodeTagsPopoverClosed = 'IAM_NODE_TAGS_POPOVER_CLOSED',
  HidePopovers = 'HIDE_POPOVERS',
  SidePanelOpened = 'SIDE_PANEL_OPENED',
  AggregateUserNodes = 'AGGREGATE_USER_NODES',
  HideFixedPopover = 'HIDE_FIXED_POPOVERS',
}

// /**
//  * Defines events that are accompanied by data, and are used to trigger state machine transitions.
//  * Can be used from any component to trigger a state machine transition.
//  */
export enum StatefulStateMachineEvent {
  AddIAMUserGroupNode = 'ADD_IAM_USER_GROUP_NODE',
  AddIAMNode = 'ADD_IAM_POLICY_NODE',
  EditIAMIdentityPolicyNode = 'EDIT_IAM_IDENTITY_POLICY_NODE',
  ConnectNodes = 'CONNECT_NODES',
  DeleteEdge = 'DELETE_EDGE',
  DeleteEdges = 'DELETE_EDGES',
  DeleteNode = 'DELETE_NODE',
  DeaggregateUserNodes = 'DEAGGREGATE_USER_NODES',
  EditNodeMetadata = 'EDIT_NODE_METADATA',
  LogAnalyticsEvent = 'LOG_ANALYTICS_EVENT',
}
