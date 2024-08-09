import { Button, MenuItem, ModalContent, Input, Select, Box } from '@chakra-ui/react';
import type {
  ButtonProps,
  MenuItemProps,
  ModalContentProps,
  InputProps,
  SelectProps,
  BoxProps,
} from '@chakra-ui/react';

import { withPopover } from '@/decorators/withPopover';

export const WithPopoverButton = withPopover<ButtonProps & { elementid: string }>(Button);
export const WithPopoverMenuItem = withPopover<MenuItemProps & { elementid: string }>(MenuItem);
export const WithPopoverModalContent = withPopover<ModalContentProps & { elementid: string }>(
  ModalContent
);
export const WithPopoverInput = withPopover<InputProps & { elementid: string }>(Input);
export const WithPopoverSelect = withPopover<SelectProps & { elementid: string }>(Select);
export const WithPopoverBox = withPopover<BoxProps & { elementid: string }>(Box);
