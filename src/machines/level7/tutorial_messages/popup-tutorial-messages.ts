import { AccountID } from '../types/node-id-enums';
import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPUP_MSG1 = `
  So far, our policies granted permissions to users and roles.
  Those are **identity-based policies**.

  Now let’s talk **resource-based policies**—
  they let us do cross-account access *without* IAM roles.
`;

const POPUP_MSG2 = `
  **Resource-based policies** attach directly to AWS resources,
  not IAM entities.

  Same JSON structure, plus a **Principal** that names who gets access.

  ~~~js
  {
    Version: "2012-10-17",
    Statement: [
      {
        "Effect": "Allow", ::badge[ALLOWS THE SPECIFIED ACTIONS]::
        "Action": ["s3:GetObject"], ::badge[READING OBJECTS]::
        "Resource": "arn:aws:s3:::my-bucket/*", ::badge[THIS SPECIFIC BUCKET]::
        "Principal": { ::badge[IAM USER THAT IS ALLOWED ACCESS]::
          "AWS": "arn:aws:iam::${AccountID.TrustedAccount}:user/leon-kennedy"
        }
      }
    ]
  }|fullwidth
  ~~~
`;

const POPUP_MSG3 = `
  A **resource-based policy** is basically a regular permission policy
  plus a **Principal**.

  The **Principal** is the entity allowed access to the resource,
  using the same format as trust policies.
`;

const POPUP_MSG4 = `
  You’ve now seen how **resource-based policies** enable cross-account access.

  Quick recap of policy types so far:
  - **Identity-based policies**: attached to IAM users/roles
  - **Resource-based policies**: attached to resources (S3, SNS, etc.)
  - **Trust policies**: attached to roles (who can assume them)

  Next up: **Permission Boundaries** 🔥
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Resource-based policies',
    content: POPUP_MSG1,
  },
  {
    title: 'Resource-based policy structure',
    content: POPUP_MSG2,
  },
  {
    title: 'Resource-based policies recap',
    content: POPUP_MSG3,
  },
  {
    title: 'Level recap',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
];
