export enum ElementID {
  CodeEditorHelpButton = 'code-editor-help-button',
  CodeEditorPolicyTab = 'code-editor-policy-tab',
  CodeEditorPopup = 'code-editor-popup',
  CodeEditorResourcePolicyTab = 'code-editor-resource-policy-tab',
  CodeEditorRoleTab = 'code-editor-role-tab',
  CodeEditorSCPTab = 'code-editor-scp-tab',
  CodeEditorPermissionBoundaryTab = 'code-editor-permission-boundary-tab',
  CreateUserGroupMenuItem = 'create-entities-menu-item',
  CreateRolesAndPoliciesMenuItem = 'create-roles-and-policies-menu-item',
  IAMIdentityCreatorPopup = 'iam-identity-creator-popup',
  IAMIdentityNameInput = 'iam-identity-name',
  IAMIdentitySelectorTypeForCreation = 'iam-identity-selector-type-for-creation',
  IAMNodeContentButton = 'iam-node-content-button',
  IAMNodeTagsButton = 'iam-node-tags-button',
  IAMNodeArnButton = 'iam-node-arn-button',
  IAMNodeContentCloseButton = 'iam-node-content-close-button',
  IAMNodeContentEditButton = 'iam-node-content-edit-button',
  IAMPolicyRoleSelectorTypeForCreation = 'iam-policy-role-selector-type-for-creation',
  IdentityCreationPopupGroupTab = 'identity-creation-popup-group-tab',
  IdentityCreationPopupUserTab = 'identity-creation-popup-user-tab',
  NewEntityBtn = 'new-entity-btn',
  ObjectivesSidePanel = 'objectives-side-panel',
  RightSidePanelToggleButton = 'right-side-panel-toggle-button',
  TutorialPopoverCloseButton = 'tutorial-popover-close-button',
  ResetZoomButton = 'reset-zoom-button',
  AccountSelectionDropdown = 'account-select-dropdown',
  CreateGroupTab = 'create-group-tab',
  CreateUserTab = 'create-user-tab',
  GoToNextLevelButton = 'go-to-next-level-button',
}

export type CodeEditorTabsElementID =
  | ElementID.CodeEditorPolicyTab
  | ElementID.CodeEditorRoleTab
  | ElementID.CodeEditorSCPTab
  | ElementID.CodeEditorResourcePolicyTab
  | ElementID.CodeEditorPermissionBoundaryTab;
