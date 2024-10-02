import type { PlacementWithLogical } from '@chakra-ui/react';
import type { Edge, Node, XYPosition } from 'reactflow';

import type {
  CreatableIAMNodeEntity,
  IAMPolicyNodeData,
  IAMPolicyRoleCreationObjective,
} from '@/types';
import {
  IAMAnyNodeData,
  IAMEdgeData,
  IAMGroupNodeData,
  IAMNodeEntity,
  IAMUserNodeData,
} from '@/types';

export interface GenericContext {
  iam_user_template: Node<IAMUserNodeData>;
  iam_group_template: Node<IAMGroupNodeData>;
  iam_policy_template?: Node<IAMPolicyNodeData>;
  level_title: string;
  level_description: string;
  level_number: number;
  next_popover_index: number;
  next_popup_index: number;
  state_name: string;
  next_iam_node_id: { [k in CreatableIAMNodeEntity]: number };
  nodes: Node<IAMAnyNodeData>[];
  edges: Edge[];
  final_edges: Edge[];
  show_popovers: boolean;
  show_popups: boolean;
  metadata_keys: { [key: string]: string }; // Make it stricter
  next_iam_node_default_position: XYPosition;
  fixed_iam_nodes_positions?: { [key: string]: XYPosition };
  popover_content?: PopoverTutorialMessage;
  popup_content?: PopupTutorialMessage;
  level_objectives: { [key: string]: LevelObjective };
  next_policy_role_objectives_index?: number;
  next_edges_connection_objectives_index?: number;
  level_finished?: boolean;
  side_panel_open?: boolean;
  policy_role_objectives: IAMPolicyRoleCreationObjective[];
  edges_connection_objectives: EdgeConnectionObjective[];
}

// Serves as a list of all events that the UI elements can send to the state machine
export type GenericEventData =
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
        | 'CREATE_IAM_IDENTITY_TAB_CHANGED'
        | 'IAM_USER_ATTACHED_TO_GROUP'
        | 'IAM_POLICY_ATTACHED_TO_GROUP'
        | 'TOGGLE_SIDE_PANEL';
    }
  | { type: 'ADD_IAM_NODE'; node: Node }
  | { type: 'ADD_IAM_USER_NODE'; node: Node }
  | { type: 'ADD_IAM_GROUP_NODE'; node: Node }
  | { type: 'UPDATE_IAM_NODE'; node: Node }
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

export type InsideTutorial = 'inside_tutorial';
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

export type LevelObjective = {
  label: string;
  finished: boolean;
};

export type EdgeConnectionObjective = {
  required_edges: Edge[];
  locked_edges: Edge[];
  on_finish_event: string;
  is_finished: boolean;
};
