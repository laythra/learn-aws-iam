import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  ::badge[Objective]:: Connect a policy node to a user node to grant permissions.
  Drag from the policy’s handle to the user and you’re set.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: "Let's grant access",
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
    tutorial_gif: 'connecting-nodes',
  },
];
