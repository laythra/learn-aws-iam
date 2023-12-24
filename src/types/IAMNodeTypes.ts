import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export type AntdIconType = React.ForwardRefExoticComponent<AntdIconProps & React.RefAttributes<HTMLSpanElement>>;

export interface IAMNodeProps {
    id: string,
    type: string,
    label: string,
    icon: AntdIconType,
    description: string,
}

export interface IAMSidePanelNodeProps extends IAMNodeProps {
    iconName: string,
}

export interface IAMNode extends Omit<IAMNodeProps, 'icon' | 'label'> {}


