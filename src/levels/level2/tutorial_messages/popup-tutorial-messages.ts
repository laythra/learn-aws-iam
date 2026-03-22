import { PopupTutorialMessage } from '@/types/tutorial-message-types';

const POPUP_MSG_1 = `
  In the previous level, we covered the basics of **IAM Users** and **IAM Policies**.|lg

  In this level, we'll explore **IAM Groups** and how
  they make managing permissions at scale much more straightforward.|lg
`;

const POPUP_MSG_2 = `
  Nice work completing level 2!|lg

  This level focused on **IAM Groups** and how they simplify
  permission management across multiple users.|lg

  Next up: **Customer Managed IAM Policies** — a more flexible way
  to define and reuse permissions across your AWS account.|lg

  > |color(rule)
    ::badge[RULE]:: **FYI: Permissions are additive. If a user belongs to multiple groups,
   they receive the combined permissions of all those groups.**
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Level 2: IAM Groups',
    content: POPUP_MSG_1,
  },
  {
    title: 'Level 2 completed! 🔥',
    content: POPUP_MSG_2,
    go_to_next_level_button: true,
  },
];
