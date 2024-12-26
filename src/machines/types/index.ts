import type { PlacementWithLogical } from '@chakra-ui/react';
import { Schema, ValidateFunction } from 'ajv';
import type { Edge, Node, XYPosition } from 'reactflow';

import type {
  AccessLevel,
  CreatableIAMNodeEntity,
  IAMPolicyNodeData,
  IAMScriptableEntity,
  PolicyRoleGrantedAccess,
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
  POLICY_ROLE_CREATION_OBJECTIVE = 'POLICY_ROLE_CREATION_OBJECTIVE',
  POLICY_ROLE_EDIT_OBJECTIVE = 'POLICY_ROLE_EDIT_OBJECTIVE',
  IAM_USER_GROUP_CREATION_OBJECTIVE = 'IAM_USER_GROUP_CREATION_OBJECTIVE',
  EDGE_CONNECTION_OBJECTIVE = 'EDGE_CONNECTION_OBJECTIVE',
  LEVEL_OBJECTIVE = 'LEVEL_OBJECTIVE',
}

export type BaseFinishEventMap = Record<ObjectiveType, string>;

export interface GenericContext<TObjectiveID, TBaseFinishEventMap extends BaseFinishEventMap> {
  iam_user_template?: Node<IAMUserNodeData>;
  iam_group_template?: Node<IAMGroupNodeData>;
  iam_policy_template?: Node<IAMPolicyNodeData>;
  level_title: string;
  level_description: string;
  level_number: number;
  next_popover_index: number;
  next_popup_index: number;
  state_name: string;
  next_iam_node_id?: { [k in CreatableIAMNodeEntity]: number };
  nodes: Node<IAMAnyNodeData>[];
  edges: Edge[];
  final_edges?: Edge[];
  show_popovers: boolean;
  show_popups: boolean;
  metadata_keys: { [key: string]: string }; // Make it stricter
  next_iam_node_default_position?: XYPosition;
  fixed_iam_nodes_positions?: { [key: string]: XYPosition };
  popover_content?: PopoverTutorialMessage;
  popup_content?: PopupTutorialMessage;
  next_policy_role_objectives_index?: number;
  next_edges_connection_objectives_index?: number;
  level_finished?: boolean;
  side_panel_open?: boolean;
  level_objectives: LevelObjective<TObjectiveID, TBaseFinishEventMap>[];
  policy_role_objectives: IAMPolicyRoleCreationObjective<TBaseFinishEventMap>[];
  policy_role_edit_objectives: IAMPolicyRoleEditObjective<TBaseFinishEventMap>[];
  edges_connection_objectives: EdgeConnectionObjective<TBaseFinishEventMap>[];
  user_group_creation_objectives: IAMUserGroupCreationObjective<TBaseFinishEventMap>[];
  next_level_objectives_list_index?: number;
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
  | { type: 'ADD_IAM_POLICY_NODE'; doc_string: string }
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
      type: 'ATTACH_POLICY_TO_ENTITY';
      sourceNode: Node<IAMPolicyNodeData>;
      targetNode: Node<IAMUserNodeData | IAMGroupNodeData>;
    }
  | {
      type: 'ATTACH_USER_TO_GROUP';
      sourceNode: Node<IAMUserNodeData>;
      targetNode: Node<IAMGroupNodeData>;
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
};

export interface IAMPolicyRoleCreationObjective<TFinishEventMap extends BaseFinishEventMap> {
  readonly type: ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE;
  readonly entity_id: string;
  readonly entity: IAMScriptableEntity;
  readonly json_schema: Schema;
  readonly description?: string;
  readonly initial_code: object;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE];
  readonly validate_inside_code_editor: boolean;
  readonly granted_accesses: PolicyRoleGrantedAccess[];
  readonly validate_function?: ValidateFunction;
  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
}

export interface IAMPolicyRoleEditObjective<TFinishEventMap extends BaseFinishEventMap> {
  readonly type: ObjectiveType.POLICY_ROLE_EDIT_OBJECTIVE;
  readonly entity_id: string;
  readonly entity: IAMScriptableEntity;
  readonly json_schema: Schema;
  readonly allow_new_lines?: boolean;

  /**
   * Optional description for the IAM Policy/Role Edit Objective.
   * Used to help the user understand what they need to do when editing the IAM Policy/Role.
   */
  readonly description?: string;

  readonly on_finish_event: TFinishEventMap[ObjectiveType.POLICY_ROLE_EDIT_OBJECTIVE];
  readonly validate_function: ValidateFunction;

  /**
   * Resources to grant to the users/groups associated with the IAM Policy/Role.
   */
  readonly resources_to_grant: Record<string, AccessLevel>;

  /**
   * Resources to revoke from the users/groups associated with the IAM Policy/Role.
   */
  readonly resources_to_revoke: string[];
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
