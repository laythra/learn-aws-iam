import { PopupTutorialMessage } from '@/machines/types';

const POPUP_MSG_1 = `
  #### It's time to scale things up a bit!

  You'll see that we have multiple policies
  laying around here, and attached to your **IAM user**|lg
`;

const POPUP_MSG_2 = `
  We would like to create a new **IAM user** for a new team member that will join your team,
  and we want to make sure that they have the same permissions as you do.|lg

  Attaching policies to individual **IAM users** can be a bit cumbersome,
  so we're going to create an **IAM group** to make things easier|lg
`;

const POPUP_MSG_3 = `
  Attaching policies to individual **IAM users** can be a bit cumbersome,
  so we're going to create an **IAM group** to make things easier.|lg
`;

const POPUP_MSG_4 = `
  **IAM groups** are a way to manage permissions for multiple **IAM users**.
  You can attach **IAM Policies** to an **IAM group**, and all **IAM users** in that group
  will inherit those permissions.|lg

  &nbsp;

  #### shall we begin?
`;

const POPUP_MSG_5 = `
  **IAM groups** are a way to manage permissions for multiple **IAM users**.
  Giving permissions to new team members is now a breeze!|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'IAM Groups',
    content: POPUP_MSG_1,
    lottie_animation: 'rocket',
  },
  {
    title: 'IAM Groups',
    content: POPUP_MSG_2,
  },
  {
    title: 'IAM Groups',
    content: POPUP_MSG_3,
  },
  {
    title: 'IAM Groups',
    content: POPUP_MSG_4,
  },
  {
    title: 'There you have it! 🔥',
    content: POPUP_MSG_5,
    lottie_animation: 'rocket',
  },
];
