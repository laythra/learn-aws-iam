import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export type AntdIconType = React.ForwardRefExoticComponent<
  AntdIconProps & React.RefAttributes<HTMLSpanElement>
>;

export interface IAMNodeProps {
  id: string;
  type: string;
  label: string;
  icon: AntdIconType;
  description: string;
  iconName: string;
}
