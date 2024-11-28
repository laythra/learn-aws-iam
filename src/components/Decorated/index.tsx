import { Button, MenuItem, ModalContent, Input, Select, Box, IconButton } from '@chakra-ui/react';
import type {
  ButtonProps,
  MenuItemProps,
  ModalContentProps,
  InputProps,
  SelectProps,
  BoxProps,
  IconButtonProps,
} from '@chakra-ui/react';

import { withPopover } from '@/decorators/withPopover';
import { withStatemachineEvent } from '@/decorators/withStatemachineEvent';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export const WithPopoverButton = withPopover<ButtonProps & { elementid: string }>(Button);
export const WithPopoverMenuItem = withPopover<MenuItemProps & { elementid: string }>(MenuItem);
export const WithPopoverModalContent = withPopover<ModalContentProps & { elementid: string }>(
  ModalContent
);
export const WithPopoverInput = withPopover<InputProps & { elementid: string }>(Input);
export const WithPopoverSelect = withPopover<SelectProps & { elementid: string }>(Select);
export const WithPopoverBox = withPopover<BoxProps & { elementid: string }>(Box);

export const WithStateMachineEventIconButton = withStatemachineEvent<
  IconButtonProps & { event: StatelessStateMachineEvent }
>(IconButton);

export const WithStateMachineEventButton = withStatemachineEvent<
  ButtonProps & { event: StatelessStateMachineEvent }
>(Button);
