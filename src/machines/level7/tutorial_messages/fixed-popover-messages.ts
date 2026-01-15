import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  We’ve got an **IAM User** and an **S3 bucket**.
  Let’s grant access using a **resource-based policy**.
`;

const FIXED_POPOVER_MSG2 = `
  You’ll see two accounts on the canvas again.
  This time, we’ll do cross-account access **without** an IAM role.
`;

const FIXED_POPOVER_MSG3 = `
  So why did we bother with roles before?
  Because **resource-based policies** aren’t supported everywhere.
`;

const FIXED_POPOVER_MSG4 = `
  **S3 buckets** and **SNS topics** can have resource-based policies,
  but **EC2 instances** and **DynamoDB tables** cannot.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Creating a resource-based policy',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Cross-account access',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Cross-account access limitations',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Cross-account access limitations',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
