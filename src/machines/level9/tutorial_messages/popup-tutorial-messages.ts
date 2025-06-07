import { PopupTutorialMessage } from '@/machines/types';
const POPUP_MSG1 = `

  We will dive into a simply yet very powerful concept called **Tag Based Access Control**.|lg

  But before that, we need to introduce a new simple concept called **Tags**.|lg

  Tags are key-value pairs that you can assign to most AWS resources,
  this includes IAM entities like \`users\`, \`groups\`, \`roles\`, and \`policies\`.|lg
`;

const POPUP_MSG2 = `
  We're back to the same multi-account setup from the previous level,
  but this time, we will be doing a better job at
  organizing access using **Tag Based Access Control (TBAC)**.
`;

const POPUP_MSG3 = `
  You've just used the tags attached to the IAM users to establish a
  **Tag Based Access Control (TBAC)** system, which is a powerful way to manage access
  to resources based on tags.

  But hold on, we're barely scratching the surface of what you can do
  with tags and conditions in IAM policies.

  The upcoming level will unlock even more advanced features,
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Tags in AWS IAM 🏷️',
    content: POPUP_MSG1,
  },
  {
    title: 'AWS Accounts and OUs',
    content: POPUP_MSG2,
  },
  {
    title: 'Level 9 completed! 🔥',
    content: POPUP_MSG3,
    go_to_next_level_button: true,
  },
];
