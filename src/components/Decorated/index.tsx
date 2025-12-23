import {
  Button,
  MenuItem,
  ModalContent,
  Input,
  Select,
  Box,
  IconButton,
  MenuButton,
  Text,
  PopoverCloseButton,
} from '@chakra-ui/react';
import type {
  ButtonProps,
  MenuItemProps,
  ModalContentProps,
  InputProps,
  SelectProps,
  BoxProps,
  IconButtonProps,
  MenuButtonProps,
  TextProps,
  PopoverCloseButtonProps,
} from '@chakra-ui/react';

import { withPopover } from '@/decorators/withPopover';
import { withStatemachineEvent } from '@/decorators/withStatemachineEvent';
import { withTutorialGuard } from '@/decorators/withTutorialGuard';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export const WithPopoverButton = withPopover<ButtonProps & { 'data-element-id': string }>(Button);
export const WithPopoverMenuItem = withPopover<MenuItemProps & { 'data-element-id': string }>(
  MenuItem
);
export const WithPopoverModalContent = withPopover<
  ModalContentProps & { 'data-element-id': string }
>(ModalContent);
export const WithPopoverInput = withPopover<InputProps & { 'data-element-id': string }>(Input);
export const WithPopoverSelect = withPopover<SelectProps & { 'data-element-id': string }>(Select);
export const WithPopoverBox = withPopover<BoxProps & { 'data-element-id': string }>(Box);
export const WithPopoverText = withPopover<TextProps & { 'data-element-id': string }>(Text);

export const WithStateMachineEventIconButton = withStatemachineEvent<
  IconButtonProps & { event: StatelessStateMachineEvent }
>(IconButton);

export const WithStateMachineEventButton = withStatemachineEvent<
  ButtonProps & { event: StatelessStateMachineEvent }
>(Button);

export const WithStateMachineEventPopoverCloseButton = withStatemachineEvent<
  PopoverCloseButtonProps & { event: StatelessStateMachineEvent }
>(PopoverCloseButton);

export const TutorialGuardedButton = withTutorialGuard<ButtonProps & { 'data-element-id': string }>(
  Button
);
export const TutorialGuardedMenuButton = withTutorialGuard<
  MenuButtonProps & { 'data-element-id': string } & IconButtonProps
>(MenuButton);

export const MenuItemWithStateMachineEvent = withStatemachineEvent<
  MenuItemProps & { event: StatelessStateMachineEvent }
>(MenuItem);
export const MenuItemWithEventAndPopover = withPopover<
  MenuItemProps & { event: StatelessStateMachineEvent; 'data-element-id': string }
>(MenuItemWithStateMachineEvent);
export const GuardedMenuItemWithEventAndPopover = withTutorialGuard<
  MenuItemProps & { event: StatelessStateMachineEvent; 'data-element-id': string }
>(MenuItemWithEventAndPopover);
export const GuardedIconButtonWithStateMachineEvent = withTutorialGuard<
  IconButtonProps & { event: StatelessStateMachineEvent; 'data-element-id': string }
>(WithStateMachineEventIconButton);

export const GuardedMenuItemWithPopover = withTutorialGuard<
  MenuItemProps & { 'data-element-id': string }
>(WithPopoverMenuItem);

export const IconButtonWithEventAndPopover = withPopover<
  IconButtonProps & { event: StatelessStateMachineEvent; 'data-element-id': string }
>(WithStateMachineEventIconButton);
