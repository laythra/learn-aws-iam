import { Edge, Node } from '@xyflow/react';
import { DOMKeyframesDefinition, DynamicAnimationOptions } from 'framer-motion';

// Re-export from split files for backwards compatibility
export * from './iam-enums';
export * from './iam-policy-types';
export * from './iam-layout-types';
export * from './iam-node-data-types';

import { AccessLevel, IAMCodeDefinedEntity, IAMNodeEntity } from './iam-enums';
import {
  IAMAccountNodeData,
  IAMAggregatedUsersNodeData,
  IAMGroupNodeData,
  IAMOUNodeData,
  IAMPermissionBoundaryNodeData,
  IAMPolicyNodeData,
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
export type IAMPolicyNode = Node<IAMPolicyNodeData, 'policy'>;
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
  [IAMNodeEntity.Policy]: IAMPolicyNode;
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

export type IAMEdge = Edge<IAMEdgeData, 'default'>;

export type IAMNodeWithPolicies = IAMUserNode | IAMGroupNode | IAMRoleNode;
export type IAMNodeWithUsers = IAMGroupNode | IAMRoleNode;
export type IAMNodeWithRoles = IAMUserNode;

export type IAMNodeAnimationConfig = {
  element_class: string;
  keyframes: DOMKeyframesDefinition;
  options: DynamicAnimationOptions;
}[];

interface IAMEdgeData extends Record<string, unknown> {
  source_node: IAMAnyNode;
  target_node: IAMAnyNode;
  hovering_label?: AccessLevel | string;
  persistent_label?: string;
  type: 'default';
  achieved_objective_id?: number;
  color: string;
  hovering_color: string;
  stroke_width: number;
  unnecessary_edge?: boolean;
  is_blocked?: boolean;
  parent_edge_id?: string;
  attached_as: IAMNodeEntity;
}

export type PartialEdge = Omit<Partial<IAMEdge>, 'data'> & {
  data?: Partial<IAMEdge['data']>;
};
