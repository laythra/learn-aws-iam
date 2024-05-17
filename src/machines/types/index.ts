import type { Edge, Node } from 'reactflow';

export type Context = {
  level_title: string;
  level_description: string;
  level_number: number;
  active_popover_index: number;
  popovers_sequence_ids: string[];
  state_name: string;
  nodes: Node[];
  inside_tutorial: boolean;
  metadata_keys: { [key: string]: string };
  // target_edges: Edge[];
};

export type EventData = {
  type:
    | 'NEXT'
    | 'NEXT_POPOVER'
    | 'IAM_POLICY_CONNECTED'
    | 'IAM_USER_CREATED'
    | 'BEGIN'
    | 'COMPLETE';
};

export type InsideTutorialMetadata = {
  popover_id: number;
  popover_title: string;
  popover_content: string;
};

export type MiniEdge = Pick<Edge, 'source' | 'target' | 'id'>;

export type InsideLevelMetadata = {
  connection_targets?: {
    // What this basically means, is that achieving all required_edges will unlock all locked_edges
    required_edges: Edge[];
    locked_edges: Edge[];
  }[];
};

export type InsideTutorial = 'inside_tutorial';
