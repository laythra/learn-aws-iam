import { Edge, HandleProps, Node } from '@xyflow/react';
import { DOMKeyframesDefinition, DynamicAnimationOptions } from 'framer-motion';

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
  Full = 'Full',
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
}

export enum IAMNodeResourceEntity {
  Resource = 'AWS Resource',
  S3Bucket = 'S3 Bucket',
  DynamoDBTable = 'DynamoDB Table',
  EC2Instance = 'EC2 Instance',
  CloudFront = 'CloudFront CDN',
  Billing = 'Billing and Cost Management',
  Lambda = 'Lambda Function',
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
}

export type CreatableIAMNodeEntity =
  | IAMNodeEntity.User
  | IAMNodeEntity.Group
  | IAMNodeEntity.Policy
  | IAMNodeEntity.Role;

export interface PolicyGrantedAccess {
  readonly target_node: string;
  readonly access_level: AccessLevel;
  readonly target_handle: string;
  readonly source_handle?: string;
}

export interface PolicyBlockedAccess {
  readonly target_handle: string;
  readonly source_handle?: string;
  readonly access_level: AccessLevel;
  readonly target_node: string;
}

/**
 * Defines the logical placemenet of the node in the layout
 * Nodes belonging to the same layout group will be positioned relative to each other
 * and stacked according to the layout direction
 * Currently unused, but placing it here so that I don't forget about it in the future
 */
export interface NodeLayoutGroup {
  id: string;
  parent_id?: string; // optional, if it's nested
  initial_position: string;
  layout_direction: 'horizontal' | 'vertical';
  vertical_spacing?: number;
  horizontal_spacing?: number;
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
  initial_position?: string;
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
   * Defines the layout group to which the node belongs,
   * TODO: Use this to define which layout group the node belongs to
   */
  layout_group_id?: string;
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
}

interface IAMSCPNodeData extends IAMNodeData {
  entity: IAMNodeEntity.SCP;
  editable: boolean;
  blocked_accesses: PolicyBlockedAccess[];
  initial_edges?: Edge<IAMEdgeData>[];
  content: string;
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

export type IAMUserNode = Node<IAMUserNodeData, 'user'>;
// Using 'group' as the type causes react-flow to render the node improperly for some reason
export type IAMGroupNode = Node<IAMGroupNodeData, 'iam_group'>;
export type IAMPolicyNode = Node<IAMPolicyNodeData, 'policy'>;
export type IAMResourceNode = Node<IAMResourceNodeData, 'resource'>;
export type IAMRoleNode = Node<IAMRoleNodeData, 'role'>;
export type IAMAccountNode = Node<IAMAccountNodeData, 'account'>;
export type IAMOUNode = Node<IAMOUNodeData, 'ou'>;
export type IAMSCPNode = Node<IAMSCPNodeData, 'scp'>;

export type IAMNodeMap = {
  [IAMNodeEntity.Policy]: IAMPolicyNode;
  [IAMNodeEntity.User]: IAMUserNode;
  [IAMNodeEntity.Group]: IAMGroupNode;
  [IAMNodeEntity.Role]: IAMRoleNode;
  [IAMNodeEntity.Resource]: IAMResourceNode;
  [IAMNodeEntity.Account]: IAMAccountNode;
  [IAMNodeEntity.OU]: IAMOUNode;
  [IAMNodeEntity.SCP]: IAMSCPNode;
};

export type IAMAnyNode = IAMNodeMap[keyof IAMNodeMap];

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
  source_node?: IAMAnyNode;
  target_node?: IAMAnyNode;
  hovering_label?: AccessLevel | string;
  type: 'default';
  achieved_objective_id?: number;
  color: string;
  hovering_color: string;
  stroke_width: number;
  label_always_visible: boolean;
  unnecessary_edge?: boolean;
}

export type PartialEdge = Omit<Partial<IAMEdge>, 'data'> & {
  data?: Partial<IAMEdge['data']>;
};

export type IAMNodeDataMapping = {
  iam_user: IAMUserNodeData;
  iam_group: IAMGroupNodeData;
};
