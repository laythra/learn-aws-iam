import { FixedPopoverMessage } from '@/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  We have an IAM user and an S3 bucket.
  Let's grant bucket access using a **resource-based policy**.
`;

const FIXED_POPOVER_MSG2 = `
  You now have a canvas with two accounts, like in the previous level.
  This time, achieve cross-account access without creating an IAM role.
`;

const FIXED_POPOVER_MSG3 = `
  You might be wondering: why use IAM roles in the previous level
  if resource-based policies can also grant cross-account access?

  The answer is simple: **resource-based policies** are not available on every AWS resource.
`;

const FIXED_POPOVER_MSG4 = `
  Resources like **S3 buckets** and **SNS topics** can use resource-based policies.
  Others, like **EC2 instances**, cannot.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Creating a Resource-Based Policy',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Cross-Account Access',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Cross-Account Access Limitations',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Cross-Account Access Limitations',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
