import { PopupTutorialMessage } from '@/machines/types';
const POPUP_MSG1 = `
  We got a breif introduction to **Tag Based Access Control (TBAC)** in the last level,
  we'll now dive even deeper into utilizing **Tags** and **Conditions** in IAM Policies.

  This time, we'll also use something called ***Policy Variables***,
  which are placeholders that get replaced with actual values when the policy is evaluated.
`;

const POPUP_MSG2 = `
  Great job! You've completed the level! 🔥

  We've covered more ground on **Tag Based Access Control (TBAC)**,
  and we are swiftly gaining more confidence in creating complex IAM policies.

  The next level will hone our policy creation skills even further,
  as we will be utilizing what's called **Request Tags** to manage access control,
  and allow teams to move faster and more efficiently.
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
