import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Follow the steps in the right panel to finish this objective.
  ::badge[Hint]:: Each step has a hint button if you get stuck.
`;

const FIXED_POPOVER_MSG2 = `
  Attach the role to the **IAM User** so they can assume it.
`;

const FIXED_POPOVER_MSG4 = `
  Quick roles vs policies recap:
  * **Roles** give temporary credentials to trusted entities.
  * **Policies** are attached permanently.
  * Roles unlock **cross-account** and **service-to-service** access.

  We’re using roles here to make cross-account access work.
`;

const FIXED_POPOVER_MSG6 = `
  Mission time:

  * Grant the **EC2 instance** the ability to *write* to the **S3 bucket**.
  * Grant the **Lambda function** the ability to *read* from the **S3 bucket**.

  ::badge[Reminder]:: Use **IAM Roles** for this.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: "This level's objective",
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
];
