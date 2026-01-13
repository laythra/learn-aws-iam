import { HandleProps } from '@xyflow/react';

import { IAMNodeEntity, IAMNodeImage, IAMNodeResourceEntity } from './iam-enums';
import { ValidInitialPosition } from './iam-layout-types';
import { PolicyGrantedAccess } from './iam-policy-types';

/**
 * Serves as a base interface for all node data types.
 *
 * Should not be used directly
 */
export interface IAMNodeData extends Record<string, unknown> {
  label: string;
  entity: IAMNodeEntity;
  description?: string;
  parent_id?: string;
  /**
   * The content of the node, namely a JSON string representing the node's data
   */
  content?: string;
  handles: HandleProps[];
  image: IAMNodeImage;
  /**
   * Defines the initial position of the node relative to the canvas viewport
   */
  initial_position?: ValidInitialPosition;
  /**
   * Defines the account for which the node belongs to
   * mainly used for multi-account scenarios
   */
  account_id?: string;
  ou_id?: string;
  /**
   * Defines whether the node is required for the user to complete the level
   */
  unnecessary_node: boolean;

  /**
   * Defines the amount of space between its adjacent vertical nodes
   */
  vertical_spacing: number;

  // /**
  //  * Defines the amount of space between its adjacent horizontal nodes
  //  */
  horizontal_spacing: number;
  // /**
  //  * Defines the amount of space between its adjacent nodes
  //  */
  layout_direction: 'horizontal' | 'vertical';

  /**
   * Defines the layout group to which the node belongs
   */
  layout_group_id: string;
  /**
   * Tags associated with the node.
   * The first element of each pair (the key) must be unique across all tags.
   */
  tags: Array<[string, string]>;

  /**
   * Defines which node entities can connect to this node
   */
  allowed_sources?: IAMNodeEntity[];
  show_pulse_animation?: boolean;
  alert_message?: string;
}

export interface IAMGuardRailsNodeData<TIsEdgeBlockedFnName extends string = string>
  extends IAMNodeData {
  entity: IAMNodeEntity.SCP | IAMNodeEntity.PermissionBoundary;
  editable: boolean;

  /**
   * Defines a function name which determines whether an edge is blocked by this guard rails node.
   */
  is_edge_blocked_fn_name: TIsEdgeBlockedFnName;
  content: string;
  blocked_edge_content: string;
}

export interface IAMUserNodeData extends IAMNodeData {
  entity: IAMNodeEntity.User;
  allowed_sources: [IAMNodeEntity.Policy, IAMNodeEntity.PermissionBoundary];
  aggregated?: boolean;
}

export interface IAMAggregatedUsersNodeData extends IAMNodeData {
  entity: IAMNodeEntity.AggregatedUsers;
  allowed_sources: [IAMNodeEntity.Policy, IAMNodeEntity.PermissionBoundary];
  aggregated?: boolean;
  aggregated_user_ids: string[];
  original_edge_mappings: Record<string, string>; // Maps original user IDs to edge IDs
}

export interface IAMGroupNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Group;
}

export interface IAMPolicyNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Policy;
  editable: boolean;
  granted_accesses: PolicyGrantedAccess[];
  content: string;
}

export interface IAMResourcePolicyNodeData extends IAMNodeData {
  entity: IAMNodeEntity.ResourcePolicy;
  editable: boolean;
  granted_accesses: PolicyGrantedAccess[];
  content: string;
  resource_node_id: string;
}

export interface IAMRoleNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Role;
  editable: boolean;
  trust_policy_content: string;
}

export interface IAMResourceNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Resource;
  resource_type: IAMNodeResourceEntity;
  associated_roles: string[];
}

export interface IAMAccountNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Account;
  collapsed?: boolean;
  expanded_height: number;
  expanded_width: number;
}

export interface IAMOUNodeData extends IAMNodeData {
  entity: IAMNodeEntity.OU;
}

export interface IAMPermissionBoundaryNodeData<TIsEdgeBlockedFnName extends string = string>
  extends IAMGuardRailsNodeData<TIsEdgeBlockedFnName> {
  entity: IAMNodeEntity.PermissionBoundary;
}

export interface IAMSCPNodeData<TIsEdgeBlockedFnName extends string = string>
  extends IAMGuardRailsNodeData<TIsEdgeBlockedFnName> {
  entity: IAMNodeEntity.SCP;
}

export type IAMNodeDataOverrides<T extends IAMNodeData> = Partial<T> & { id?: string };
