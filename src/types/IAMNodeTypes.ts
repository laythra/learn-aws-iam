import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export type AntdIconType = React.ForwardRefExoticComponent<AntdIconProps & React.RefAttributes<HTMLSpanElement>>;

export interface IAMNodeProps {
    label: string,
    icon: AntdIconType,
}

export interface IAMSidePanelNodeProps extends IAMNodeProps {
    iconName: string,
}
