import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Grant permissions to users by attaching policy nodes directly to user nodes in the canvas
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: "Let's start granting access",
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
    tutorial_gif: 'connecting-nodes',
  },
];
