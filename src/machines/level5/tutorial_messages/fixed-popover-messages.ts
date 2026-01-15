import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Check the **Trust Policy**: the \`Principal\` is an **IAM User**.

  Close the Trust Policy and you’ll see the **identity-based policy**
  attached to the role—that’s what defines the role’s permissions.

  ***Close the code view to continue.***
`;

const FIXED_POPOVER_MSG2 = `
  Attach the role to the **IAM User** so they can assume it.
`;

const FIXED_POPOVER_MSG4 = `
  Roles vs policies, in short:
  * **Roles** give temporary credentials to trusted entities.
  * **Policies** are directly attached and act as permanent permissions.
  * Roles unlock scenarios like **cross-account** and **service-to-service** access.

  For this part, we’re using roles for service-to-service access.
`;

const FIXED_POPOVER_MSG6 = `
  As *TimeShift Labs’* IAM specialist, here’s the mission:

  * Let the **EC2 instance** *write* to the **S3 bucket**.
  * Let the **Lambda function** *read* from the **S3 bucket**.

  ::badge[Reminder]:: Use **IAM Roles** for this—policies alone won’t cut it.
`;

const FIXED_POPOVER_MSG7 = `
  All set. The EC2 instance can write to the bucket,
  and the Lambda function can read from it to generate metadata.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Attach role to user',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'Make the user assume the role',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'IAM roles vs policies',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Your mission!',
    popover_content: FIXED_POPOVER_MSG6,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Service-to-service access established 🫡',
    popover_content: FIXED_POPOVER_MSG7,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
