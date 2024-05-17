import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { HandleProps } from 'reactflow';

export type AntdIconType = React.ForwardRefExoticComponent<
  AntdIconProps & React.RefAttributes<HTMLSpanElement>
>;

export enum IAMNodeEntity {
  User = 'User',
  Group = 'Group',
  Role = 'Role',
  Policy = 'Policy',
  Resource = 'Resource',
}

export enum IAMResourceEntity {
  S3 = 'S3',
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
}

export interface IAMUserNodeProps extends IAMNodeProps {
  associatedPolicies: IAMNodeProps[];
}

export interface IAMGroupNodeProps extends IAMNodeProps {
  users: IAMUserNodeProps[];
}

export interface IAMPolicyNodeProps extends IAMNodeProps {}
