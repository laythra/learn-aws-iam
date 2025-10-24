import type { PlacementWithLogical } from '@chakra-ui/react';
import type { Edge } from '@xyflow/react';
import { DynamicAnimationOptions } from 'framer-motion';

import { ElementID } from '@/config/element-ids';
import type {
  AccessLevel,
  CreatableIAMNodeEntity,
  HandleID,
  IAMAnyNode,
  IAMEdge,
  IAMGroupNode,
  IAMCodeDefinedEntity,
  IAMUserNode,
  PolicyGrantedAccess,
  NodeLayoutGroup,
} from '@/types';
import { IAMNodeEntity } from '@/types';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export type HelpBadge = {
  path: string;
  content: string;
  color: string;
};

export enum ObjectiveType {
  POLICY_CREATION_OBJECTIVE = 'POLICY_CREATION_OBJECTIVE',
  RESOURCE_POLICY_CREATION_OBJECTIVE = 'RESOURCE_POLICY_CREATION_OBJECTIVE',
  SCP_CREATION_OBJECTIVE = 'SCP_CREATION_OBJECTIVE',
  POLICY_EDIT_OBJECTIVE = 'POLICY_EDIT_OBJECTIVE',
  TRUST_POLICY_EDIT_OBJECTIVE = 'TRUST_POLICY_EDIT_OBJECTIVE',
  ROLE_CREATION_OBJECTIVE = 'ROLE_CREATION_OBJECTIVE',
  IAM_USER_GROUP_CREATION_OBJECTIVE = 'IAM_USER_GROUP_CREATION_OBJECTIVE',
  EDGE_CONNECTION_OBJECTIVE = 'EDGE_CONNECTION_OBJECTIVE',
  LEVEL_OBJECTIVE = 'LEVEL_OBJECTIVE',
  PERMISSION_BOUNDARY_CREATION_OBJECTIVE = 'PERMISSION_BOUNDARY_CREATION_OBJECTIVE',
}

export type BaseFinishEventMap = Record<ObjectiveType, string>;
export type FinishEventMapWithDefaults<T extends Partial<Record<ObjectiveType, string>>> = {
  [K in ObjectiveType]: K extends keyof T ? T[K] : never;
};

export type NodeConnection = {
  from: IAMAnyNode;
  to: IAMAnyNode;
  parent_edge_id?: string;
};

export type InitialNodeConnection = {
  from: string;
  to: string;
  source_handle?: HandleID;
  target_handle?: HandleID;
};

export interface GenericContext<TObjectiveID, TBaseFinishEventMap extends BaseFinishEventMap> {
  edges: IAMEdge[];
  edges_connection_objectives: EdgeConnectionObjective<TBaseFinishEventMap>[];
  level_description: string;
  level_finished?: boolean;
  level_number: number;
  level_objectives: LevelObjective<TObjectiveID, TBaseFinishEventMap>[];
  level_title: string;
  nodes: IAMAnyNode[];
  policy_creation_objectives: BaseCreationObjective<TBaseFinishEventMap>[];
  // resource_policy_creation_objectives?: IAMResourcePolicyCreationObjective<TBaseFinishEventMap>[];
  // scp_creation_objectives?: IAMSCPCreationObjective<TBaseFinishEventMap>[];
  policy_edit_objectives: IAMPolicyEditObjective<TBaseFinishEventMap>[];
  popover_content?: PopoverTutorialMessage;
  popup_content?: PopupTutorialMessage;
  // role_creation_objectives: IAMRoleCreationObjective<TBaseFinishEventMap>[];
  show_popovers: boolean;
  show_popups: boolean;
  show_fixed_popovers: boolean;
  fixed_popover_content?: FixedPopoverMessage;
  side_panel_open?: boolean;
  user_group_creation_objectives: IAMUserGroupCreationObjective<TBaseFinishEventMap>[];
  // eslint-disable-next-line
  // permission_boundary_creation_objectives?: IAMPermissionBoundaryCreationObjective<TBaseFinishEventMap>[];
  use_multi_account_canvas?: boolean;
  highlighted_element_id?: string;
  in_tutorial_state?: boolean;
  show_help_popover?: boolean;
  whitelisted_element_ids?: string[];
  help_tips?: HelpTip[];
  /*
    Defines the list of elements that are always hidden or disabled, regardless of the current state.
  */
  restricted_element_ids?: string[];
  edges_management_disabled?: boolean;
  animations?: Record<string, DynamicAnimationOptions>;
  identity_creation_popup_default_value?: IAMNodeEntity.User | IAMNodeEntity.Group;
  elements_with_animated_red_dot?: ElementID[];
  show_unncessary_edges_or_nodes_warning?: boolean;
  initial_node_connections?: InitialNodeConnection[];
  layout_groups: NodeLayoutGroup[];
}

// Serves as a list of all events that the UI elements can send to the state machine
export type GenericEventData<TBaseFinishEventMap extends BaseFinishEventMap> =
  | {
      type:
        | 'NEXT'
        | 'NEXT_POPOVER'
        | 'NEXT_POPUP'
        | 'NEXT_FIXED_POPOVER'
        | 'CREATE_USER_POPUP_OPENED'
        | 'HIDE_POPOVERS'
        | 'HIDE_FIXED_POPOVERS'
        | 'CREATE_POLICY_POPUP_OPENED'
        | 'CREATE_IAM_IDENTITY_POPUP_OPENED'
        | 'TOGGLE_SIDE_PANEL'
        | StatelessStateMachineEvent
        | (TBaseFinishEventMap[keyof TBaseFinishEventMap] & string);
    }
  | {
      type: StatefulStateMachineEvent.AddIAMUserGroupNode;
      node_entity: IAMNodeEntity.Group | IAMNodeEntity.User;
      node_data: Partial<IAMUserNode['data']> | Partial<IAMGroupNode['data']>;
    }
  | {
      type: StatefulStateMachineEvent.ADDIAMRoleNode;
      doc_string: string;
      account_id?: AccountID;
      label: string;
    }
  | {
      type: StatefulStateMachineEvent.EditIAMPolicyNode;
      node_id: string;
      doc_string: string;
    }
  | {
      type: StatefulStateMachineEvent.AddIAMNode;
      doc_string: string;
      label: string;
      account_id?: AccountID;
      node_entity: IAMCodeDefinedEntity;
    }
  | {
      type: StatefulStateMachineEvent.AddIAMResourcePolicyNode;
      doc_string: string;
      label: string;
      account_id?: AccountID;
    }
  | {
      type: StatefulStateMachineEvent.AddIAMSCPNode;
      doc_string: string;
      label: string;
    }
  | {
      type: StatefulStateMachineEvent.AddIAMPermissionBoundaryNode;
      doc_string: string;
      label: string;
      account_id?: AccountID;
    }
  | {
      type: StatefulStateMachineEvent.ConnectNodes;
      sourceNode: IAMAnyNode;
      targetNode: IAMAnyNode;
    }
  | {
      type: StatefulStateMachineEvent.DeleteEdge;
      edge: IAMEdge;
    }
  | {
      type: StatefulStateMachineEvent.DeleteNode;
      node: IAMAnyNode;
    }
  | { type: 'UPDATE_RED_DOT_VISIBILITY'; element_ids: ElementID[]; is_visible: boolean };

export type FixedPopoverMessage = {
  popover_title: string;
  popover_content: string;
  show_next_button: boolean;
  show_close_button: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

export type PopoverTutorialMessage = {
  element_id: string;
  popover_title: string;
  popover_content: string;
  show_next_button: boolean;
  show_close_button: boolean;
  popover_placement?: PlacementWithLogical;
  image_path?: string;
};

export type PopupTutorialMessage = {
  /**
   * The ID of the popup, used for testing purposes.
   * TODO: Make it required when the popup is used in the tutorial.
   */
  id?: string;
  title: string;
  content: string;
  image?: string;
  lottie_animation?: string;
  go_to_next_level_button?: boolean;
};

export type LevelObjective<TObjectiveID, TFinishEventMap extends BaseFinishEventMap> = {
  type: ObjectiveType.LEVEL_OBJECTIVE;
  id: TObjectiveID;
  label: string;
  finished: boolean;
  on_finish_event?: TFinishEventMap[ObjectiveType.LEVEL_OBJECTIVE];
  hint_text?: string;
};

export type EdgeConnectionObjective<TFinishEventMap extends BaseFinishEventMap> = {
  readonly type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE;
  readonly required_edges: Edge[];
  /**
   * @deprecated Use `granted_accesses` inside policies instead
   */
  locked_edges?: Edge[];
  readonly on_finish_event: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE];
  readonly is_finished: boolean;
  readonly established_edge_hovering_label: AccessLevel | string;
  readonly established_edge_target_handle?: string;
  readonly established_edge_source_handle?: string;
};

export interface BaseCreationObjective<TFinishEventMap extends BaseFinishEventMap> {
  /**
   * Unique identifier for the objective.
   * This ID is used as the node ID upon creation and as the objective's identifier in the state machine context.
   */
  readonly id: string;
  readonly entity: unknown;
  readonly type: ObjectiveType;
  readonly initial_code: object;
  readonly on_finish_event:
    | TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE]
    | TFinishEventMap[ObjectiveType.SCP_CREATION_OBJECTIVE]
    | TFinishEventMap[ObjectiveType.ROLE_CREATION_OBJECTIVE]
    | TFinishEventMap[ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE]
    | TFinishEventMap[ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE];
  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
  readonly initial_position?: string;
  readonly account_id?: AccountID;
  readonly created_node_initial_position?: string;
  readonly callout_message?: string;
  readonly hint_messages?: { title: string; content: string }[];
  readonly created_node_parent_id?: string;
  readonly layout_group_id?: string;
  finished: boolean;
  /**
   * Extra data overridable by each objective type
   */
  extra_data: Record<string, unknown>;
}

// TODO: Create a common interface for IAMPolicyCreationObjective and IAMResourcePolicyCreationObjective
// to avoid code duplication
// TODO: Rename IAMPolicyCreationObjective to IAMPermissionPolicyCreationObjective
export interface IAMPolicyCreationObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TApplicableNodesFnName extends string = string,
> extends BaseCreationObjective<TFinishEventMap> {
  readonly entity: IAMNodeEntity.Policy;
  readonly type: ObjectiveType.POLICY_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE];
  readonly extra_data: {
    granted_accesses: PolicyGrantedAccess<TApplicableNodesFnName>[];
  };
}

export interface IAMResourcePolicyCreationObjective<TFinishEventMap extends BaseFinishEventMap>
  extends BaseCreationObjective<TFinishEventMap> {
  readonly entity: IAMNodeEntity.ResourcePolicy;
  readonly type: ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE];
  readonly extra_data: {
    readonly initial_edges: IAMEdge[];
    readonly resource_node_id: string;
  };
}

export interface IAMSCPCreationObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TIsEdgeBlockedFnName extends string = string,
> extends BaseCreationObjective<TFinishEventMap> {
  readonly type: ObjectiveType.SCP_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.SCP_CREATION_OBJECTIVE];
  readonly entity: IAMNodeEntity.SCP;
  readonly extra_data: {
    readonly is_edge_blocked_fn_name: TIsEdgeBlockedFnName;
    readonly blocked_edge_content: string;
  };
}

export interface IAMPermissionBoundaryCreationObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TIsEdgeBlockedFnName extends string = string,
> extends BaseCreationObjective<TFinishEventMap> {
  readonly type: ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE];
  readonly entity: IAMNodeEntity.PermissionBoundary;
  readonly extra_data: {
    readonly is_edge_blocked_fn_name: TIsEdgeBlockedFnName;
    readonly blocked_edge_content: string;
  };
}

export interface IAMRoleCreationObjective<TFinishEventMap extends BaseFinishEventMap>
  extends BaseCreationObjective<TFinishEventMap> {
  readonly type: ObjectiveType.ROLE_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.ROLE_CREATION_OBJECTIVE];
  readonly entity: IAMNodeEntity.Role;
  readonly extra_data: {
    readonly required_policies: string[];
    readonly required_principles: string[];
  };
}

export interface IAMPolicyEditObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TValidateFn = string,
> {
  readonly id: string;
  /**
   * Unique identifier for the objective.
   * In creation objectives, the ID of the objective itself is sufficient to identify the validate function to use.
   * In edit objectives, we use `validate_fn_name` since we can have multiple edit objectives for the same node.
   */
  readonly validate_fn_name: TValidateFn;
  readonly type: ObjectiveType.POLICY_EDIT_OBJECTIVE;
  readonly entity: IAMCodeDefinedEntity;
  readonly allow_new_lines?: boolean;

  /**
   * Optional callout_message for the IAM Policy/Role Edit Objective.
   * Used to help the user understand what they need to do when editing the IAM Policy/Role.
   */
  readonly callout_message?: string;

  readonly on_finish_event: TFinishEventMap[ObjectiveType.POLICY_EDIT_OBJECTIVE];

  /**
   * Resources to grant to the users/groups associated with the IAM Policy/Role.
   */
  readonly resources_to_grant: PolicyGrantedAccess[];

  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
  readonly hint_messages?: { title: string; content: string }[];
  finished: boolean;
}

export interface IAMTrustPolicyEditObjective<TFinishEventMap extends BaseFinishEventMap> {
  readonly id: string;
  readonly type: ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE;
  readonly entity: IAMNodeEntity.Role;
  readonly allow_new_lines?: boolean;

  /**
   * Optional description for the IAM Policy/Role Edit Objective.
   * Used to help the user understand what they need to do when editing the IAM Policy/Role.
   */
  readonly description?: string;

  readonly on_finish_event: TFinishEventMap[ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE];
  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
}

export type IAMUserGroupCreationObjective<TFinishEventMap extends BaseFinishEventMap> = {
  readonly entity_id: string;
  readonly type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE];
  readonly entity_to_create: CreatableIAMNodeEntity;
  readonly initial_position?: string;
  readonly created_node_parent_id?: string;
  readonly layout_group_id?: string;
  finished: boolean;
};

export enum AccountID {
  Trusting = '123456789012',
  Trusted = '987654321098',
}

export type HelpTip = 'ConnectNodes' | 'CreatePolicies';
