import { FixedPopoverMessage } from '@/types/tutorial-message-types';

const POPUP_MSG_1 = `
  The current setup has a single **IAM User (sam)** with 3 policies attached.
  Each policy grants access to a different **AWS Service**.

  ::badge[TIP]:: Hover over the edges to view the permission level.
`;

const POPUP_MSG_2 = `
  If we wanted to add more **IAM Users** to our account,
  we'd have to attach the same **policies** to each **user** individually.
  That gets tedious fast.
`;

const POPUP_MSG_3 = `
  That's exactly where **IAM Groups** come in.
  This level will introduce you to **IAM Groups**
  and how they make permission management at scale much simpler.
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
