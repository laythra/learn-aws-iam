import { FixedPopoverMessage } from '@/machines/types';

const POPUP_MSG_1 = `
  The current setup involves a single **IAM User (Kyouma)** with a set of 3 permissions.
  Each permission grants access to a different **AWS Service**.

  You can hover over the edges to view the permission level.
`;

const POPUP_MSG_2 = `
  If we wanted to add a bunch of new **IAM Users** to our account,
  we'd have to attach the same **policies** to each **user** individually.
  This can be a bit cumbersome.
`;

const POPUP_MSG_3 = `
  Here's where **IAM Groups** come in handy!
  This level will introduce you to **IAM Groups**
  and how they can help you manage permissions at scale.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Level 2: IAM Groups',
    popover_content: POPUP_MSG_1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Level 2: IAM Groups',
    popover_content: POPUP_MSG_2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Level 2: IAM Groups',
    popover_content: POPUP_MSG_3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
