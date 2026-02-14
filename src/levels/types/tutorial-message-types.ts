import type { PlacementWithLogical } from '@chakra-ui/react';

export type FixedPopoverMessage = {
  popover_title: string;
  popover_content: string;
  show_next_button: boolean;
  show_close_button: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  tutorial_video?: string;
};

export type PopoverTutorialMessage = {
  element_id: string;
  popover_title: string;
  popover_content: string;
  show_next_button: boolean;
  show_close_button: boolean;
  popover_placement?: PlacementWithLogical;
  tutorial_video?: string;
};

export type PopupTutorialMessage = {
  title: string;
  content: string;
  tutorial_video?: string;
  go_to_next_level_button?: boolean;
};
