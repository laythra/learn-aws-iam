import { Button, MenuItem, ModalContent } from '@chakra-ui/react';
import type { ButtonProps, MenuItemProps, ModalContentProps } from '@chakra-ui/react';

import { withPopover } from '@/decorators/withPopover';

export const WithPopoverButton = withPopover<
  ButtonProps & { id: string; container_ref?: React.RefObject<HTMLElement> }
>(Button);
export const WithPopoverMenuItem = withPopover<MenuItemProps & { id: string }>(MenuItem);
export const WithPopoverModalContent = withPopover<
  ModalContentProps & { id: string; container_ref?: React.RefObject<HTMLDivElement> }
>(ModalContent);
