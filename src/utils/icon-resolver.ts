import { UserOutlined } from '@ant-design/icons';
import { AntdIconType } from 'types';

export function resolveIcon(label: string): AntdIconType {
  switch (label) {
    case 'User':
      return UserOutlined;
    default:
      return UserOutlined;
  }
}
