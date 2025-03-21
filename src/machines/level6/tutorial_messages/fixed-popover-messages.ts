import { FixedPopoverMessage } from '@/machines/types';

const FIXED_POPOVER_MSG1 = `
  Follow the steps to the right side panel to achieve this level's objective.
  You can always consult the *Hint* button for each step if you're stuck. 😉
`;

const FIXED_POPOVER_MSG2 = `
  Try attaching the role to the **IAM User** so that the user assumes the role.
`;

const FIXED_POPOVER_MSG4 = `
  You might be curious about the distinction between granting access to a user
  via an **IAM role** versus using a traditional **IAM policy**.

  There are a few key differences that are too boring to list here, but here's a summary:
  * **IAM Roles** provide temporary credentials to trusted entities,
  unlike policies which are permanently attached
  * **IAM Roles** solve use cases not possible with policies,
  like cross-account access, or service-to-service access

  For this part of the level, we'll using **IAM roles** to establish service-to-service access.
`;

const FIXED_POPOVER_MSG6 = `
  As the IAM Security Specialist at ***Timeshift Labs***,
  you have some exciting challenges ahead:

  * Grant the **EC2 instance** the necessary means to *write* into the **S3 bucket**
  * Grant the **Lambda Function** the necessary means to *read* from the **S3 bucket**

  Remember, regular **IAM Policies** won't work here, so let's get creative with **IAM Roles**!
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: "This Level's Objective",
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Make the user assume the role',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'IAM Roles vs Policies',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Your Mission!',
    popover_content: FIXED_POPOVER_MSG6,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
