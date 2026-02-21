import { FixedPopoverMessage } from '@/levels/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  ::badge[core]::
  Grant permissions to a user by connecting a policy node to their user node on the canvas
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: "Let's start granting access",
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
    tutorial_video: 'connecting-nodes',
  },
];
