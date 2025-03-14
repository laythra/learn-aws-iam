import { DOMKeyframesDefinition, DynamicAnimationOptions } from 'framer-motion';
import { HandleProps } from 'reactflow';

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

/**
 * Serves as a base interface for all node data types.
 *
 * Should not be used directly
 */
interface IAMNodeData {
  id: string;
  label: string;
  entity: IAMNodeEntity;
  description?: string;
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
}

export interface IAMUserNodeData extends IAMNodeData {
  entity: IAMNodeEntity.User;
  associated_policies: string[];
  associated_roles: string[];
}

export interface IAMGroupNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Group;
  associated_users: string[];
  associated_policies: string[];
}

export interface IAMPolicyNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Policy;
  editable: boolean;
  associated_users: string[]; // Do we use this?
  granted_accesses: PolicyGrantedAccess[];
  content: string;
}

export interface IAMRoleNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Role;
  editable: boolean;
  associated_users: string[];
  associated_policies: string[];
  associated_resources: string[];
  trust_policy_content: string;
}

export interface IAMResourceNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Resource;
  resource_type: IAMNodeResourceEntity;
  associated_roles: string[];
}

export type IAMAnyNodeData =
  | IAMUserNodeData
  | IAMGroupNodeData
  | IAMPolicyNodeData
  | IAMResourceNodeData
  | IAMRoleNodeData;

export type IAMNodeWithPolicies = IAMUserNodeData | IAMGroupNodeData | IAMRoleNodeData;
export type IAMNodeWithUsers = IAMGroupNodeData | IAMRoleNodeData;
export type IAMNodeWithRoles = IAMUserNodeData;

export type IAMNodeAnimationConfig = {
  element_class: string;
  keyframes: DOMKeyframesDefinition;
  options: DynamicAnimationOptions;
}[];

export interface IAMEdgeData {
  source_node_data?: IAMAnyNodeData;
  target_node_data?: IAMAnyNodeData;
  hovering_label?: AccessLevel | string;
  /**
   * The ID of the edge that was resposible for the creation of this edge
   * mainly used for deleting edges, such that deleting an edge will also delete its children
   */
  parent_edge_id?: string;
  achieved_objective_id?: number;
  color: string;
  hovering_color: string;
  stroke_width: number;
  label_always_visible: boolean;
  unnecessary_edge?: boolean;
}

export type IAMNodeDataMapping = {
  iam_user: IAMUserNodeData;
  iam_group: IAMGroupNodeData;
};
