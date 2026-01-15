import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const POPUP_MSG_1 = `
  Right now we’ve got one **IAM User (Kyouma)** with three different permissions.
  Each edge shows access to a different **AWS service**.

  ::badge[Tip]:: Hover an edge to see the exact permission level.
`;

const POPUP_MSG_2 = `
  If we needed to add more users, we’d have to attach those same **policies**
  one-by-one. That gets old fast.
`;

const POPUP_MSG_3 = `
  That’s why **IAM Groups** exist.
  They let you manage permissions once and scale to many users.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'IAM Groups',
    popover_content: POPUP_MSG_1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'IAM Groups',
    popover_content: POPUP_MSG_2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'IAM Groups',
    popover_content: POPUP_MSG_3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
