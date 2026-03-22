import { PopupTutorialMessage } from '@/types/tutorial-message-types';
const POPUP_MSG1 = `
  We got a brief introduction to **Tag-Based Access Control (TBAC)** in the last level.
  In this level, we'll go deeper into using **tags** and **conditions** in IAM policies.

  This time, you'll also use ***policy variables***,
  which are placeholders that get replaced with actual values when the policy is evaluated.
`;

const POPUP_MSG2 = `
  Great job! You've completed the level! 🔥|lg

  You covered more ground on **Tag-Based Access Control (TBAC)**
  and strengthened your IAM policy skills.|lg

  The next level goes further with **request tags** for access control,
  helping teams move faster while keeping permissions controlled.|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Time to get serious about creating complex policies',
    content: POPUP_MSG1,
  },
  {
    title: 'Level 9 completed! 🔥',
    content: POPUP_MSG2,
    go_to_next_level_button: true,
  },
];
