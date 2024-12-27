import { HandleProps } from 'reactflow';

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
}

export enum IAMNodeImage {
  User = 'user',
  S3Bucket = 'bucket',
  Policy = 'policy',
  Group = 'group',
  Database = 'database',
  Server = 'server',
  CDN = 'cdn',
}

export type CreatableIAMNodeEntity =
  | IAMNodeEntity.User
  | IAMNodeEntity.Group
  | IAMNodeEntity.Policy
  | IAMNodeEntity.Role;

export interface PolicyRoleGrantedAccess {
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
}

export interface IAMUserNodeData extends IAMNodeData {
  entity: IAMNodeEntity.User;
  associated_policies: string[];
}

export interface IAMGroupNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Group;
  associated_users: string[];
  associated_policies: string[];
}

export interface IAMPolicyNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Policy;
  editable: boolean;
  unnecessary_policy?: boolean;
  associated_users: string[];
  granted_accesses: PolicyRoleGrantedAccess[];
  content: string;
}

export interface IAMRoleNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Role;
  editable: boolean;
  associated_users: string[];
  attached_policies: IAMPolicyNodeData[];
  trust_policy_content: string;
}

export interface IAMResourceNodeData extends IAMNodeData {
  entity: IAMNodeEntity.Resource;
  resource_type: IAMNodeResourceEntity;
}

export type IAMAnyNodeData =
  | IAMUserNodeData
  | IAMGroupNodeData
  | IAMPolicyNodeData
  | IAMResourceNodeData;

export interface IAMEdgeData {
  source_node_data?: IAMAnyNodeData;
  target_node_data?: IAMAnyNodeData;
  hovering_label?: AccessLevel | string;
}

export type IAMNodeDataMapping = {
  iam_user: IAMUserNodeData;
  iam_group: IAMGroupNodeData;
};
