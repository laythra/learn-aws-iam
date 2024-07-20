import type { PlacementWithLogical } from '@chakra-ui/react';
import type { Edge, Node } from 'reactflow';

import { IAMCanvasNodeData, IAMNodeEntity } from '@/types';

export interface GenericContext {
  iam_user_template: Node<IAMCanvasNodeData>;
  iam_group_template?: Node<IAMCanvasNodeData>;
  level_title: string;
  level_description: string;
  level_number: number;
  next_popover_index: number;
  next_popup_index: number;
  state_name: string;
  next_iam_node_id: number;
  nodes: Node[];
  edges: Edge[];
  final_edges: Edge[];
  show_popovers: boolean;
  show_popups: boolean;
  metadata_keys: { [key: string]: string }; // Make it stricter
  next_node_position: { x: number; y: number };
  popover_content?: PopoverTutorialMessage;
  popup_content?: PopupTutorialMessage;
  default_policy?: string;
  level_objectives: { [key: string]: LevelObjective };
  level_finished?: boolean;
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
        | 'CREATE_IAM_IDENTITY_TAB_CHANGED';
    }
  | { type: 'ADD_IAM_NODE'; node: Node }
  | { type: 'ADD_EDGE'; edge: Edge }
  | { type: 'SET_EDGES'; edges: Edge[] }
  | { type: 'SET_NODES'; nodes: Node[] }
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
};

export type LevelObjective = {
  label: string;
  finished: boolean;
};
