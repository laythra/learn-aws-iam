import { PopupTutorialMessage } from '@/machines/types';

const POPUP_MSG_1 = `
  In the previous level, we learned about the very basics of **IAM users** and **IAM policies**.|lg

  For this level, we'll talk about **IAM Groups** and how
  they can help us scale our permissions management with ease|lg
`;

const POPUP_MSG_2 = `
  Congrats on finishing the second level of our long journey!|lg

  The level mainly covered the usage of **IAM Groups** and
  how they can help us manage permissions at scale.|lg

  We'll learn about **Customer Managed IAM Policies** in the next level
  and how they can help us manage permissions more effectively!|lg
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
