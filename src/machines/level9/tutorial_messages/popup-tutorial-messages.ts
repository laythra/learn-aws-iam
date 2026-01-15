import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';
const POPUP_MSG1 = `
  Last level introduced **Tag-Based Access Control (TBAC)**.
  Now we’ll go deeper with **tags**, **conditions**, and **policy variables**.

  Policy variables are placeholders that get resolved at evaluation time.
`;

const POPUP_MSG2 = `
  Level 9 complete! 🔥

  You’ve leveled up on **TBAC** and complex policy patterns.

  Next level: **request tags** for even smarter access control.
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Time to get serious about complex policies',
    content: POPUP_MSG1,
  },
  {
    title: 'Level 9 completed! 🔥',
    content: POPUP_MSG2,
    go_to_next_level_button: true,
  },
];
