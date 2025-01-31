import type { PlacementWithLogical } from '@chakra-ui/react';
import { Schema, ValidateFunction } from 'ajv';
import { DynamicAnimationOptions } from 'framer-motion';
import type { Edge, Node } from 'reactflow';

import type {
  AccessLevel,
  CreatableIAMNodeEntity,
  IAMPolicyNodeData,
  IAMRoleNodeData,
  IAMScriptableEntity,
  PolicyGrantedAccess,
} from '@/types';
import {
  IAMAnyNodeData,
  IAMEdgeData,
  IAMGroupNodeData,
  IAMNodeEntity,
  IAMUserNodeData,
} from '@/types';
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
  POLICY_EDIT_OBJECTIVE = 'POLICY_EDIT_OBJECTIVE',
  TRUST_POLICY_EDIT_OBJECTIVE = 'TRUST_POLICY_EDIT_OBJECTIVE',
  ROLE_CREATION_OBJECTIVE = 'ROLE_CREATION_OBJECTIVE',
  IAM_USER_GROUP_CREATION_OBJECTIVE = 'IAM_USER_GROUP_CREATION_OBJECTIVE',
  EDGE_CONNECTION_OBJECTIVE = 'EDGE_CONNECTION_OBJECTIVE',
  LEVEL_OBJECTIVE = 'LEVEL_OBJECTIVE',
}

export type BaseFinishEventMap = Record<ObjectiveType, string>;

export interface GenericContext<TObjectiveID, TBaseFinishEventMap extends BaseFinishEventMap> {
  edges: Edge[];
  edges_connection_objectives: EdgeConnectionObjective<TBaseFinishEventMap>[];
  level_description: string;
  level_finished?: boolean;
  level_number: number;
  level_objectives: LevelObjective<TObjectiveID, TBaseFinishEventMap>[];
  level_title: string;
  next_edges_connection_objectives_index?: number;
  next_level_objectives_list_index?: number;
  next_policy_creation_objectives_index?: number;
  next_role_creation_objectives_index?: number;
  next_popover_index: number;
  next_popup_index: number;
  nodes: Node<IAMAnyNodeData>[];
  policy_creation_objectives: IAMPolicyCreationObjective<TBaseFinishEventMap>[];
  policy_edit_objectives: IAMPolicyEditObjective<TBaseFinishEventMap>[];
  popover_content?: PopoverTutorialMessage;
  popup_content?: PopupTutorialMessage;
  role_creation_objectives: IAMRoleCreationObjective<TBaseFinishEventMap>[];
  show_popovers: boolean;
  show_popups: boolean;
  side_panel_open?: boolean;
  state_name: string;
  user_group_creation_objectives: IAMUserGroupCreationObjective<TBaseFinishEventMap>[];
  use_multi_account_canvas?: boolean;
  highlighted_element_id?: string;
  in_tutorial_state?: boolean;
  whitelisted_element_ids?: string[];
  edges_management_disabled?: boolean;
  animations?: Record<string, DynamicAnimationOptions>;
}

// Serves as a list of all events that the UI elements can send to the state machine
export type GenericEventData<TBaseFinishEventMap extends BaseFinishEventMap> =
  | {
      type:
        | 'NEXT'
        | 'NEXT_POPOVER'
        | 'NEXT_POPUP'
        | 'IAM_POLICY_CONNECTED'
        | 'IAM_USER_CREATED'
        | 'IAM_GROUP_CREATED'
        | 'BEGIN'
        | 'COMPLETE'
        | 'CREATE_USER_POPUP_OPENED'
        | 'HIDE_POPOVERS'
        | 'CREATE_POLICY_POPUP_OPENED'
        | 'CREATE_IAM_IDENTITY_POPUP_OPENED'
        | 'IAM_USER_ATTACHED_TO_GROUP'
        | 'IAM_POLICY_ATTACHED_TO_GROUP'
        | 'TOGGLE_SIDE_PANEL'
        | StatelessStateMachineEvent
        | (TBaseFinishEventMap[keyof TBaseFinishEventMap] & string);
    }
  | {
      type: StatefulStateMachineEvent.AddIAMUserGroupNode;
      node_entity: IAMNodeEntity.Group | IAMNodeEntity.User;
      node_data: Partial<IAMUserNodeData> | Partial<IAMGroupNodeData>;
    }
  | {
      type: StatefulStateMachineEvent.ADDIAMRoleNode;
      doc_string: string;
      account_id?: AccountID;
    }
  | { type: 'ADD_IAM_POLICY_NODE'; doc_string: string; account_id?: AccountID }
  | { type: 'UPDATE_IAM_POLICY_NODE'; doc_string: string; node_id: string }
  | { type: 'UPDATE_IAM_NODE'; node_id: string; props: Partial<Omit<IAMAnyNodeData, 'entity'>> }
  | { type: 'ADD_EDGE'; edge: Edge<IAMEdgeData> }
  | { type: 'DELETE_EDGE'; edge: Edge<IAMEdgeData> }
  | { type: 'SET_EDGES'; edges: Edge<IAMEdgeData>[] }
  | { type: 'SET_NODES'; nodes: Node[] }
  | { type: 'UPDATE_USER_POLICY_EDGES'; node: Node }
  | {
      type: 'ATTACH_POLICY_TO_USER';
      sourceNode: Node<IAMPolicyNodeData>;
      targetNode: Node<IAMUserNodeData>;
    }
  | {
      type: StatefulStateMachineEvent.AttachPolicyToEntity;
      sourceNode: Node<IAMPolicyNodeData>;
      targetNode: Node<IAMUserNodeData | IAMGroupNodeData | IAMRoleNodeData>;
    }
  | {
      type: 'ATTACH_USER_TO_GROUP';
      sourceNode: Node<IAMUserNodeData>;
      targetNode: Node<IAMGroupNodeData>;
    }
  | {
      type: StatefulStateMachineEvent.AttachRoleToEntity;
      sourceNode: Node<IAMRoleNodeData>;
      targetNode: Node<IAMUserNodeData>;
    }
  | { type: 'SHOW_POPOVER'; popover_content: PopoverTutorialMessage };

export type GenericInsideLevelMetadata = {
  connection_targets?: {
    // What this basically means, is that achieving all required_edges will unlock all locked_edges
    required_edges: Edge[];
    locked_edges: Edge[];
  }[];
  // What this basically means, is that the user must create all entity_targets to this stage, very simple
  entity_targets?: IAMNodeEntity[];
};

export type PopoverTutorialMessage = {
  element_id: string;
  popover_title: string;
  popover_content: string;
  show_next_button: boolean;
  show_close_button: boolean;
  popover_placement?: PlacementWithLogical;
};

export type PopupTutorialMessage = {
  title: string;
  content: string;
  image?: string;
};

export type LevelObjective<TObjectiveID, TFinishEventMap extends BaseFinishEventMap> = {
  type: ObjectiveType.LEVEL_OBJECTIVE;
  id: TObjectiveID;
  label: string;
  finished: boolean;
  on_finish_event?: TFinishEventMap[ObjectiveType.LEVEL_OBJECTIVE];
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

// TODO: Make the following interface only responsible for creating Policy creation objectives
export interface IAMPolicyCreationObjective<TFinishEventMap extends BaseFinishEventMap> {
  readonly type: ObjectiveType.POLICY_CREATION_OBJECTIVE;
  readonly entity_id: string;
  readonly entity: IAMScriptableEntity;
  readonly json_schema: Schema;
  readonly description?: string;
  readonly initial_code: object;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE];
  readonly validate_inside_code_editor: boolean;
  readonly granted_accesses: PolicyGrantedAccess[];
  readonly validate_function?: ValidateFunction;
  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
  readonly account_id?: AccountID;
  readonly created_node_initial_position?: string;
}

export interface IAMRoleCreationObjective<TFinishEventMap extends BaseFinishEventMap> {
  readonly type: ObjectiveType.ROLE_CREATION_OBJECTIVE;
  readonly entity_id: string;
  readonly entity: IAMNodeEntity.Role;
  readonly json_schema: Schema;
  readonly initial_code: object;
  readonly validate_inside_code_editor: boolean;
  readonly required_policies: string[];
  readonly required_principles: string[];
  readonly validate_function?: ValidateFunction;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.ROLE_CREATION_OBJECTIVE];
  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
  readonly account_id?: AccountID;
  readonly created_node_initial_position?: string;
}

export interface IAMPolicyEditObjective<TFinishEventMap extends BaseFinishEventMap> {
  readonly type: ObjectiveType.POLICY_EDIT_OBJECTIVE;
  readonly entity_id: string;
  readonly entity: IAMScriptableEntity;
  readonly json_schema: Schema;
  readonly allow_new_lines?: boolean;

  /**
   * Optional description for the IAM Policy/Role Edit Objective.
   * Used to help the user understand what they need to do when editing the IAM Policy/Role.
   */
  readonly description?: string;

  readonly on_finish_event: TFinishEventMap[ObjectiveType.POLICY_EDIT_OBJECTIVE];
  readonly validate_function: ValidateFunction;

  /**
   * Resources to grant to the users/groups associated with the IAM Policy/Role.
   */
  readonly resources_to_grant: Record<string, AccessLevel>;

  /**
   * Resources to revoke from the users/groups associated with the IAM Policy/Role.
   */
  readonly resources_to_revoke: string[];
  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
}

export interface IAMTrustPolicyEditObject<TFinishEventMap extends BaseFinishEventMap> {
  readonly type: ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE;
  readonly entity_id: string;
  readonly entity: IAMNodeEntity.Role;
  readonly json_schema: Schema;
  readonly allow_new_lines?: boolean;

  /**
   * Optional description for the IAM Policy/Role Edit Objective.
   * Used to help the user understand what they need to do when editing the IAM Policy/Role.
   */
  readonly description?: string;

  readonly on_finish_event: TFinishEventMap[ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE];
  readonly validate_function: ValidateFunction;

  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
}

export type IAMUserGroupCreationObjective<TFinishEventMap extends BaseFinishEventMap> = {
  readonly entity_id: string;
  readonly type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE];
  readonly entity_to_create: CreatableIAMNodeEntity;
  readonly initial_position?: string;
  finished: boolean;
};

export enum AccountID {
  Originating = 'originating',
  Destination = 'destination',
}
