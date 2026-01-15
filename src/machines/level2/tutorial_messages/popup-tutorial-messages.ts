import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPUP_MSG_1 = `
  Last level was **IAM Users** + **Policies** basics.|lg

  This time it’s **IAM Groups**—the easy way to scale access without
  attaching policies user-by-user.|lg
`;

const POPUP_MSG_2 = `
  Level 2 done!|lg

  You saw how **IAM Groups** keep permissions tidy when teams grow.|lg

  Next up: **Customer Managed Policies** and why they’re worth the effort.|lg
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
