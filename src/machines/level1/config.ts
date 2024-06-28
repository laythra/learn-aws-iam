import type { PopoverTutorialMessage, PopupTutorialMessage } from '../types';

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: 'new_entity_btn',
    popover_title: 'IAM users',
    popover_content: `Let's begin by creating your IAM user`,
    show_next_button: false,
    show_close_button: false,
  },
  {
    element_id: 'username',
    popover_title: `Let's put your name here, shall we?`,
    popover_content: ``,
    show_next_button: false,
    show_close_button: false,
  },
  {
    element_id: 'iam_user1',
    popover_title: `Tada! 🎉 This is the IAM user you just created!`,
    popover_content: `Drag your IAM user around a little bit`,
    show_next_button: true,
    show_close_button: false,
  },
  {
    element_id: 'iam_policy1',
    popover_title: `AWS managed policy`,
    popover_content: `
      This is a policy that AWS provides for you,
      click on the policy to view its details to the right
    `,
    show_next_button: true,
    show_close_button: false,
  },
];
