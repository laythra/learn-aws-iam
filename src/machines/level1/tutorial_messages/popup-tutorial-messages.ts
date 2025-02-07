import { PopupTutorialMessage } from '@/machines/types';

const POPUP_MSG1 = `
  This interactive tutorial is the most comprehensive guide
  to **AWS Identity and Access Management (IAM)**.

  Whether you're a beginner or experienced,
  you'll gain hands-on experience with detailed explanations and challenges.|lg

  You'll learn to create **users**, manage **permissions**,
  and craft policies while solving real-world scenarios.|lg

  Each level builds on essential **IAM** concepts, helping you grow your skills step by step.|lg

  Jump in and master **AWS IAM** the interactive way!|lg
`;

const POPUP_MSG2 = `
  Congrats on finishing the first level of our long journey!
  We have covered the following basics of IAM:|lg
  * Learning about **IAM Users**, **IAM Policies**, and **AWS Resources**
  * Understanding the basic role of **IAM Policies** in managing permissions
  * Attaching **IAM Policies** to **IAM Users** in order to grant the disignated permissions

  We'll learn about **IAM Groups** in the next level and how they can help us scale things up!|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Learn AWS IAM in a fun way',
    content: POPUP_MSG1,
  },
  {
    title: 'Level 1 completed! 🔥',
    content: POPUP_MSG2,
    go_to_next_level_button: true,
  },
];
