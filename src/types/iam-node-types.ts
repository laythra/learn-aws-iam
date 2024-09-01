import { HandleProps, XYPosition } from 'reactflow';

export enum IAMNodeEntity {
  User = 'IAM User',
  Group = 'IAM Group',
  Role = 'IAM Role',
  Policy = 'IAM Policy',
  Resource = 'AWS Resource',
  S3Bucket = 'S3 Bucket',
  DynamoDBTable = 'DynamoDB Table',
  EC2Instance = 'EC2 Instance',
}

export enum IAMNodeImage {
  User = 'user',
  S3Bucket = 'bucket',
  Policy = 'policy',
  Group = 'group',
  Database = 'database',
  Server = 'server',
}

export type CreatableIAMNodeEntity =
  | IAMNodeEntity.User
  | IAMNodeEntity.Group
  | IAMNodeEntity.Policy
  | IAMNodeEntity.Role;

// Serves as a base interface for all node data types
// Should not be used directly
interface IAMNodeData {
  id: string;
  label: string;
  entity: IAMNodeEntity;
  description: string;
  content?: string;
  handles: HandleProps[];
  image: IAMNodeImage;
  code?: string;
  initial_position?: string; // Defines the initial position of the node relative to the canvas viewport
}

export interface IAMUserNodeData extends IAMNodeData {
  associated_policies: IAMNodeData[];
}

export interface IAMGroupNodeData extends IAMNodeData {
  attached_users: IAMUserNodeData[];
  attached_policies: IAMPolicyNodeData[];
}

export interface IAMPolicyNodeData extends IAMNodeData {
  resources_affected: string[];
}

export interface IAMGroupNodeData extends IAMNodeData {}
export interface IAMResourceNodeData extends IAMNodeData {}

export type IAMAnyNodeData =
  | IAMUserNodeData
  | IAMGroupNodeData
  | IAMPolicyNodeData
  | IAMResourceNodeData;

export interface IAMEdgeData {
  source_node_data: IAMAnyNodeData;
  target_node_data: IAMAnyNodeData;
}

export type IAMNodeDataMapping = {
  iam_user: IAMUserNodeData;
  iam_group: IAMGroupNodeData;
};

type IAMMinAnyNodeData = Pick<IAMAnyNodeData, 'id' | 'label' | 'code' | 'initial_position'> & {
  position: XYPosition;
};

export type IAMMinPolicyNodeData = IAMMinAnyNodeData &
  Pick<IAMPolicyNodeData, 'resources_affected'>;

export type IAMMinGroupNodeData = IAMMinAnyNodeData;
