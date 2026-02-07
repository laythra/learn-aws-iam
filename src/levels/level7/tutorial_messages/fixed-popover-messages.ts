import { FixedPopoverMessage } from '@/levels/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  We have an **IAM User** and an **S3 Bucket** laying around,
  let's give the user access to the bucket using a **Resource Based Policy**.
`;

const FIXED_POPOVER_MSG2 = `
  You're now presented with canvas containing two accounts like we did in a previous level.
  Let's try to achieve cross-account access without creating an **IAM Role**.
`;

const FIXED_POPOVER_MSG3 = `
  You maybe wondering, why did we go through the trouble of creating an **IAM Role**
  in a previous level, when we could have just used a **Resource Based Policy**?

  Well, the answer is simple: **Resource Based Policies** aren't applicable to all AWS resources.
`;

const FIXED_POPOVER_MSG4 = `
  Resources like **S3 Buckets** and **SNS Topics** can have **Resource Based Policies**,
  However, other resources like **EC2 Instances** and **DynamoDB tables** cannot.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Creating a Resource Based Policy',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Cross Account Access',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Cross Account Access Limitations',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Cross Account Access Limitations',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
