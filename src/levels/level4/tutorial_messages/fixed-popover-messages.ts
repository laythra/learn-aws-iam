import { FixedPopoverMessage } from '@/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
**TimeShift Labs** has discovered that some users have access to data and services
beyond what their roles require. The over-permissioning isn't obvious —
it stems from subtle misconfigurations in their **IAM policies**.
`;

const FIXED_POPOVER_MSG2 = `
  **TimeShift Labs** has a straightforward technical hierarchy:|lg

  * **Developers** — Should have *read/write* access to the \`CustomerData\`
      table in **DynamoDB** and *read/write* access
      to the \`timeshift-assets\` **S3 Bucket** objects.

  * **Data Scientists** — Should have *read/write* access to the \`timeshift-assets\`
    **S3 Bucket** objects and *read/write* access
    to the \`AnalyticsData\` table in **DynamoDB**.

  * **Interns** — Should only be able to read objects from the \`timeshift-assets\` **S3 Bucket**.

  Your job is to **edit** the **IAM policies** to enforce this hierarchy.
`;

const FIXED_POPOVER_MSG3 = `
You will be presented with **TimeShift Labs**' current IAM setup, including their
**IAM Users**, **IAM Resources**, and **IAM Policies**.

Your task:
* Ensure no user has more permissions than their role requires.
* Ensure no user is missing permissions they need.

**Edit** the **IAM policies** to enforce the hierarchy from the previous step.
`;

const FIXED_POPOVER_MSG4 = `
  ::badge[CORE]::
  You can edit a policy's content by clicking the \`::icon[PencilSquareIcon]::\` icon
  in the top-right corner of the policy's content view.
`;

const FIXED_POPOVER_MSG5 = `
  Permissions are all sorted out!
  Developers, Data Scientists, and Interns each have exactly the access they need.
  You're well on your way to becoming an IAM expert! 🔥
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: "TimeShift Labs' Current Situation",
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: "TimeShift Labs' Technical Hierarchy",
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Your Task as an IAM specialist',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Editing IAM Policies',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: true,
    show_next_button: false,
    tutorial_video: 'node-content-editing',
  },
  {
    popover_title: 'Permissions Sorted Out 🔥',
    popover_content: FIXED_POPOVER_MSG5,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
