import { Edge, Node } from '@xyflow/react';

import { AccessLevel, HandleID, IAMCodeDefinedEntity, IAMNodeEntity } from './iam-enums';
import {
  IAMAccountNodeData,
  IAMAggregatedUsersNodeData,
  IAMGroupNodeData,
  IAMOUNodeData,
  IAMPermissionBoundaryNodeData,
  IAMIdentityPolicyNodeData,
  IAMResourceNodeData,
  IAMResourcePolicyNodeData,
  IAMRoleNodeData,
  IAMSCPNodeData,
  IAMUserNodeData,
} from './iam-node-data-types';

export type IAMUserNode = Node<IAMUserNodeData, 'user'>;
export type IAMAggregatedUsersNode = Node<IAMAggregatedUsersNodeData, 'user_aggregated'>;
// 'group' is reserved in @xyflow/react, we're using 'iam_group' instead
export type IAMGroupNode = Node<IAMGroupNodeData, 'iam_group'>;
export type IAMIdentityPolicyNode = Node<IAMIdentityPolicyNodeData, 'policy'>;
export type IAMResourceNode = Node<IAMResourceNodeData, 'resource'>;
export type IAMRoleNode = Node<IAMRoleNodeData, 'role'>;
export type IAMAccountNode = Node<IAMAccountNodeData, 'account'>;
export type IAMOUNode = Node<IAMOUNodeData, 'ou'>;
export type IAMSCPNode<TIsEdgeBlockedFnName extends string = string> = Node<
  IAMSCPNodeData<TIsEdgeBlockedFnName>,
  'scp'
>;

export type IAMResourcePolicyNode = Node<IAMResourcePolicyNodeData, 'resource_policy'>;
export type IAMPermissionBoundaryNode<TIsEdgeBlockedFnName extends string = string> = Node<
  IAMPermissionBoundaryNodeData<TIsEdgeBlockedFnName>,
  'permission_boundary'
>;

export type IAMNodeMap = {
  [IAMNodeEntity.IdentityPolicy]: IAMIdentityPolicyNode;
  [IAMNodeEntity.User]: IAMUserNode;
  [IAMNodeEntity.Group]: IAMGroupNode;
  [IAMNodeEntity.Role]: IAMRoleNode;
  [IAMNodeEntity.Resource]: IAMResourceNode;
  [IAMNodeEntity.Account]: IAMAccountNode;
  [IAMNodeEntity.OU]: IAMOUNode;
  [IAMNodeEntity.SCP]: IAMSCPNode;
  [IAMNodeEntity.ResourcePolicy]: IAMResourcePolicyNode;
  [IAMNodeEntity.PermissionBoundary]: IAMPermissionBoundaryNode;
  [IAMNodeEntity.AggregatedUsers]: IAMAggregatedUsersNode;
};

export type IAMAnyNode = IAMNodeMap[keyof IAMNodeMap];
export type IAMCodeDefinedNode = IAMNodeMap[IAMCodeDefinedEntity];
export type IAMGuardRailsNode =
  | IAMNodeMap[IAMNodeEntity.SCP]
  | IAMNodeMap[IAMNodeEntity.PermissionBoundary];

type IAMEdgeBase = Edge<IAMEdgeData, 'default'>;
export type IAMEdge = Omit<IAMEdgeBase, 'data'> & {
  data: IAMEdgeData;
};

interface IAMEdgeData extends Record<string, unknown> {
  source_node: IAMAnyNode;
  target_node: IAMAnyNode;
  hovering_label?: AccessLevel | string;
  persistent_label?: string;
  type: 'default';
  color: string;
  hovering_color: string;
  stroke_width: number;
  unnecessary_edge?: boolean;
  is_blocked?: boolean;
  parent_edge_ids: string[];
  attached_as: IAMNodeEntity;
}

export type PartialEdge = Omit<Partial<IAMEdge>, 'data'> & {
  data?: Partial<IAMEdge['data']>;
};

/**
 * Represents a connection between two nodes at runtime.
 */
export type NodeConnection = {
  from: IAMAnyNode;
  to: IAMAnyNode;
  parent_edge_ids: string[];
};

/**
 * Represents initial connection configuration between nodes by their IDs.
 * Used for setting up edges when a level is initialized.
 */
export type InitialNodeConnection = {
  from: string;
  to: string;
  source_handle?: HandleID;
  target_handle?: HandleID;
};
