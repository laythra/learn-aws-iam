import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export type AntdIconType = React.ForwardRefExoticComponent<
  AntdIconProps & React.RefAttributes<HTMLSpanElement>
>;

export enum IAMNodeClass {
  User = 'User',
  Group = 'Group',
  Role = 'Role',
  Policy = 'Policy',
}

export interface IAMNodeProps {
  id: string;
  label: string;
  iamNodeClass: IAMNodeClass;
  description: string;
}
