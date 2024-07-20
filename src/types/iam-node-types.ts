import { HandleProps } from 'reactflow';

export enum IAMNodeEntity {
  User = 'IAM User',
  Group = 'IAM Group',
  Role = 'IAM Role',
  Policy = 'IAM Policy',
  Resource = 'AWS Resource',
  S3Bucket = 'S3 Bucket',
}

export enum IAMNodeImage {
  User = 'user',
  S3Bucket = 'bucket',
  Policy = 'policy',
  Group = 'group',
}

export interface IAMNodeData {
  id: string;
  label: string;
  entity: IAMNodeEntity;
  description: string;
  content?: string;
}

export interface IAMCanvasNodeData extends IAMNodeData {
  handles: HandleProps[];
  image: IAMNodeImage;
  code?: string;
}

export interface IAMUserNodeData extends IAMNodeData {
  associatedPolicies: IAMNodeData[];
}

export interface IAMGroupNodeData extends IAMNodeData {
  users: IAMUserNodeData[];
}

export interface IAMPolicyNodeData extends IAMNodeData {}
