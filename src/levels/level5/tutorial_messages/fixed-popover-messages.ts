import { FixedPopoverMessage } from '@/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Notice the \`Principal\` in the **Trust Policy**.
  It specifies the entity that can assume the role and it's an **IAM User**.

  There's also an **Identity-based Policy** that's attached to the **Role**,
  it defines the permissions that the principal will have once they assume the role.

  ***Close the Trust Policy through the ::icon[XMarkIcon]::
  button in the top right to view the attached policy.***
`;

const FIXED_POPOVER_MSG2 = `
  Try attaching the role to the **IAM User** so that the user assumes the role.

  > **Remember**: You need also allow the user to assume the role first.
  There's an existing policy laying around for that.
`;

const FIXED_POPOVER_MSG4 = `
  **IAM Roles** provide temporary credentials to trusted entities,
  while **IAM Policies** grant persistent access.

  Roles are ideal for service-to-service access and cross-account scenarios.
  We'll use them here to establish service-to-service access.
`;

const FIXED_POPOVER_MSG6 = `
  As the IAM Security Specialist at **Timeshift Labs**,
  you have some exciting challenges ahead:

  * Grant the **EC2 instance** the necessary permissions to *write* into the **S3 bucket**
  * Grant the **Lambda Function** the necessary permissions to *read* from the **S3 bucket**

  For this scenario, attach **IAM Policies** to **IAM Roles**
  and let the services assume those roles.
`;

const FIXED_POPOVER_MSG7 = `
  The S3 bucket is now accessible to the EC2 instance and Lambda function.
  The EC2 instance can write to the S3 bucket,
  and the Lambda function can read from it to generate the required metadata.
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
  {
    popover_title: 'Service-to-Service Access has been established 🫡',
    popover_content: FIXED_POPOVER_MSG7,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
