import { HandleProps } from 'reactflow';

export enum IAMNodeEntity {
  User = 'User',
  Group = 'Group',
  Role = 'Role',
  Policy = 'Policy',
  Resource = 'Resource',
}

export enum IAMNodeImage {
  User = 'user',
  S3Bucket = 'bucket',
  Policy = 'policy',
  Group = 'group',
}

export interface IAMNodeProps {
  id: string;
  label: string;
  entity: IAMNodeEntity;
  description: string;
  content?: string;
}

export interface IAMCanvasNodeProps extends IAMNodeProps {
  handles: HandleProps[];
  image: IAMNodeImage;
}

export interface IAMUserNodeProps extends IAMNodeProps {
  associatedPolicies: IAMNodeProps[];
}

export interface IAMGroupNodeProps extends IAMNodeProps {
  users: IAMUserNodeProps[];
}

export interface IAMPolicyNodeProps extends IAMNodeProps {}
