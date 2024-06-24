import type { PlacementWithLogical } from '@chakra-ui/react';
import type { Edge, Node } from 'reactflow';

import { IAMCanvasNodeProps, IAMNodeEntity } from '@/types';

export interface GenericContext {
  iam_user_template: Node<IAMCanvasNodeProps>;
  level_title: string;
  level_description: string;
  level_number: number;
  next_popover_index: number;
  state_name: string;
  next_iam_user_id: number;
  nodes: Node[];
  edges: Edge[];
  show_popovers: boolean;
  metadata_keys: { [key: string]: string }; // Make it stricter
  next_node_position: { x: number; y: number };
  popover_content?: TutorialMessage;
  default_policy?: string;
}

export type GenericEventData =
  | {
      type:
        | 'NEXT'
        | 'NEXT_POPOVER'
        | 'IAM_POLICY_CONNECTED'
        | 'IAM_USER_CREATED'
        | 'BEGIN'
        | 'COMPLETE'
        | 'CREATE_USER_POPUP_OPENED'
        | 'HIDE_POPOVERS';
    }
  | { type: 'ADD_IAM_NODE'; node: Node }
  | { type: 'ADD_EDGE'; edge: Edge }
  | { type: 'SET_EDGES'; edges: Edge[] }
  | { type: 'SET_NODES'; nodes: Node[] }
  | { type: 'SHOW_POPOVER'; popover_content: TutorialMessage };

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
export type TutorialMessage = {
  element_id: string;
  popover_title: string;
  popover_content: string;
  show_next_button: boolean;
  show_close_button: boolean;
  popover_placement?: PlacementWithLogical;
  container_ref?: React.RefObject<HTMLElement>; // Defines a ref to the container in which the popover should be rendered
};
