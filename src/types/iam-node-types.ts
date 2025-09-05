import { Edge, HandleProps, Node } from '@xyflow/react';
import { DOMKeyframesDefinition, DynamicAnimationOptions } from 'framer-motion';

import { ValidInitialPosition } from '@/features/canvas/utils/nodes-position';

export enum HandleID {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export enum AccessLevel {
  Read = 'Read',
  Write = 'Write',
  ReadWrite = 'Read/Write',
  Delete = 'Delete',
  Full = 'Full',
  StartStopControl = 'Control (Start/Stop)',
}

export enum IAMNodeEntity {
  User = 'IAM User',
  Group = 'IAM Group',
  Role = 'IAM Role',
  Policy = 'IAM Policy',
  Resource = 'AWS Resource',
  Account = 'Account',
  OU = 'Organizational Unit',
  SCP = 'Service Control Policy',
  ResourcePolicy = 'Resource Policy',
  PermissionBoundary = 'Permission Boundary',
}

export type IAMCodeDefinedEntity =
  | IAMNodeEntity.Policy
  | IAMNodeEntity.Role
  | IAMNodeEntity.SCP
  | IAMNodeEntity.ResourcePolicy
  | IAMNodeEntity.PermissionBoundary;

export enum IAMNodeResourceEntity {
  Resource = 'AWS Resource',
  S3Bucket = 'S3 Bucket',
  DynamoDBTable = 'DynamoDB Table',
  EC2Instance = 'EC2 Instance',
  CloudFront = 'CloudFront CDN',
  Billing = 'Billing and Cost Management',
  Lambda = 'Lambda Function',
  Secret = 'Secret',
  RDS = 'RDS',
}

export enum IAMNodeImage {
  User = 'user',
  S3Bucket = 'bucket',
  Policy = 'policy',
  Group = 'group',
  Database = 'database',
  Server = 'server',
  CDN = 'cdn',
  Role = 'role',
  Billing = 'billing',
  Lambda = 'lambda',
  OU = 'ou',
  Secret = 'secret',
  SCP = 'scp',
}

export type CreatableIAMNodeEntity =
  | IAMNodeEntity.User
  | IAMNodeEntity.Group
  | IAMNodeEntity.Policy
  | IAMNodeEntity.Role
  | IAMNodeEntity.PermissionBoundary;

export interface PolicyGrantedAccess {
  readonly target_node: string;
  readonly access_level: AccessLevel;
  readonly source_handle?: string;
  readonly target_handle: string;
  /**
   * A function which returns the list of nodes to which the access is granted.
   *
   * This is useful for policies with conditional access,
   * where the access is granted to a subset of nodes based on some condition.
   * @param nodes The list of candidate nodes to which the access might be granted.
   * @returns An array of nodes to which the access is granted.
   */
  readonly applicable_nodes?: (node: IAMAnyNode[]) => IAMAnyNode[];
}

export interface PolicyBlockedAccess {
  readonly target_handle: string;
  readonly source_handle?: string;
  readonly access_level: AccessLevel;
  readonly target_node: string;
}

/**
 * Defines logical placement of nodes in layout groups inside the canvas.
 * Nodes in the same group are positioned relative to each other and stacked by direction.
 */
export interface NodeLayoutGroup {
  id: string;
  /**
   * Defines the initial position of the group relative to the canvas viewport.
   * This is used to position the group when it is first rendered.
   */
  position: ValidInitialPosition;
  /**
   * Defines the direction in which nodes are laid out within this group.
   * 'horizontal' means nodes are laid out side by side,
   * 'vertical' means nodes are stacked on top of each other.
   */
  layout_direction: 'horizontal' | 'vertical';
  /**
   * Defines the amount of space between its adjacent vertical nodes
   * and horizontal nodes, depending on the layout direction.
   */
  vertical_spacing?: number;
  /**
   * Defines the amount of space between its adjacent horizontal nodes
   * and vertical nodes, depending on the layout direction.
   */
  horizontal_spacing?: number;
  /**
   * Defines the margin around the group.
   * Supports top and left margins.
   */
  margin?: {
    top: number;
    left: number;
  };
}

/**
 * Serves as a base interface for all node data types.
 *
 * Should not be used directly
 */
interface IAMNodeData extends Record<string, unknown> {
  id: string;
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
  /**
   * Defines animations to play for the node
   */
  animations?: Record<
    string,
    { element_class: string; keyframes: DOMKeyframesDefinition; options: DynamicAnimationOptions }[]
  >;
  /**
   * Defines whether the node is required for the user to complete the level
   */
  unnecessary_node?: boolean;

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
}

interface IAMGuardRailsNodeData extends IAMNodeData {
  entity: IAMNodeEntity.SCP | IAMNodeEntity.PermissionBoundary;
  editable: boolean;

  /**
   * A function that defines the allowed accesses for this permission boundary.
   * @param node The nodes to check against the allowed accesses.
   * @returns The allowed nodes for this permission boundary.
   */
  is_edge_blocked?: (edge: IAMEdge) => boolean;
  content: string;
}

interface IAMUserNodeData extends IAMNodeData {
  entity: IAMNodeEntity.User;
}

interface IAMGroupNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Group;
}

interface IAMPolicyNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Policy;
  editable: boolean;
  granted_accesses: PolicyGrantedAccess[];
  initial_edges?: Edge<IAMEdgeData>[];
  content: string;

  /**
   * Used for resource-based policies, such that the policy is attached to the resource
   */
  resource_node_id?: string;
}

interface IAMResourcePolicyNodeData extends IAMNodeData {
  entity: IAMNodeEntity.ResourcePolicy;
  editable: boolean;
  granted_accesses: PolicyGrantedAccess[];
  initial_edges?: Edge<IAMEdgeData>[];
  content: string;
  resource_node_id: string;
}

interface IAMRoleNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Role;
  editable: boolean;
  trust_policy_content: string;
}

interface IAMResourceNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Resource;
  resource_type: IAMNodeResourceEntity;
  associated_roles: string[];
}

interface IAMAccountNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Account;
}

interface IAMOUNodeData extends IAMNodeData {
  entity: IAMNodeEntity.OU;
}

interface IAMPermissionBoundaryNodeData extends IAMGuardRailsNodeData {
  entity: IAMNodeEntity.PermissionBoundary;
}

interface IAMSCPNodeData extends IAMGuardRailsNodeData {
  entity: IAMNodeEntity.SCP;
}

export type IAMUserNode = Node<IAMUserNodeData, 'user'>;
// 'group' is reserved in @xyflow/react, we're using 'iam_group' instead
export type IAMGroupNode = Node<IAMGroupNodeData, 'iam_group'>;
export type IAMPolicyNode = Node<IAMPolicyNodeData, 'policy'>;
export type IAMResourceNode = Node<IAMResourceNodeData, 'resource'>;
export type IAMRoleNode = Node<IAMRoleNodeData, 'role'>;
export type IAMAccountNode = Node<IAMAccountNodeData, 'account'>;
export type IAMOUNode = Node<IAMOUNodeData, 'ou'>;
export type IAMSCPNode = Node<IAMSCPNodeData, 'scp'>;

export type IAMResourcePolicyNode = Node<IAMResourcePolicyNodeData, 'resource_policy'>;
export type IAMPermissionBoundaryNode = Node<IAMPermissionBoundaryNodeData, 'permission_boundary'>;

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
}

export type PartialEdge = Omit<Partial<IAMEdge>, 'data'> & {
  data?: Partial<IAMEdge['data']>;
};

export type IAMNodeDataMapping = {
  iam_user: IAMUserNodeData;
  iam_group: IAMGroupNodeData;
};

export enum CommonLayoutGroupID {
  CenterHorizontal = 'center-horizontal',
  CenterVertical = 'center-vertical',
  TopCenterHorizontal = 'top-center-horizontal',
  TopCenterVertical = 'top-center-vertical',
  TopLeftHorizontal = 'top-left-horizontal',
  TopLeftVertical = 'top-left-vertical',
  TopRightHorizontal = 'top-right-horizontal',
  TopRightVertical = 'top-right-vertical',
  BottomCenterHorizontal = 'bottom-center-horizontal',
  BottomCenterVertical = 'bottom-center-vertical',
  BottomLeftHorizontal = 'bottom-left-horizontal',
  BottomLeftVertical = 'bottom-left-vertical',
  BottomRightHorizontal = 'bottom-right-horizontal',
  BottomRightVertical = 'bottom-right-vertical',
  LeftCenterHorizontal = 'left-center-horizontal',
  LeftCenterVertical = 'left-center-vertical',
  RightCenterHorizontal = 'right-center-horizontal',
  RightCenterVertical = 'right-center-vertical',
}
