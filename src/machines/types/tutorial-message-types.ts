import type { PlacementWithLogical } from '@chakra-ui/react';

export type FixedPopoverMessage = {
  popover_title: string;
  popover_content: string;
  show_next_button: boolean;
  show_close_button: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

export type PopoverTutorialMessage = {
  element_id: string;
  popover_title: string;
  popover_content: string;
  show_next_button: boolean;
  show_close_button: boolean;
  popover_placement?: PlacementWithLogical;
  image_path?: string;
};

export type PopupTutorialMessage = {
  /**
   * The ID of the popup, used for testing purposes.
   * TODO: Make it required when the popup is used in the tutorial.
   */
  id?: string;
  title: string;
  content: string;
  image?: string;
  lottie_animation?: string;
  go_to_next_level_button?: boolean;
};
