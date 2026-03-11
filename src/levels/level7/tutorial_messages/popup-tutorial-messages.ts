import { AccountID } from '../types/node-id-enums';
import { PopupTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPUP_MSG1 = `
  All the policies we've dealt with so far granted permissions
  to users and roles. These are called **identity-based policies**.

  Now that you've seen **cross-account access** with roles,
  let's move to **resource-based policies**.
  They can grant cross-account access without creating and assuming IAM roles.
`;

const POPUP_MSG2 = `
  What's the difference between a **resource-based policy** and an **identity-based policy**?
  Resource-based policies are attached to AWS resources,
  not just IAM entities.

  They use a similar JSON structure to identity-based policies,
  but include a **Principal** field that defines who is allowed access.

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

  > |color(warning)
  > ::badge[WARNING]::
  > Resource-based policies are embedded in a single resource and cannot be reused.
`;

const POPUP_MSG3 = `
  A **resource-based policy** is essentially a permissions policy
  with an added **Principal** field.|lg

  The **Principal** field defines who is allowed access to the resource
  and follows the same principal formats used in trust policies.|lg
`;

const POPUP_MSG4 = `
  This level covered the basics of **resource-based policies** and how they can be used
  to grant access to resources across different AWS accounts.

  Here are the policy types you've covered so far:
  - **Identity-based policies**: attached to IAM identities (users, roles)
  - **Resource-based policies**: attached to AWS resources (for example S3 buckets, SNS topics)
  - **Trust Policies**: attached to IAM roles, specifying which entities can assume the role

  The next level introduces another powerful policy type:
  *permission boundaries* 🔥.
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Resource-Based Policies',
    content: POPUP_MSG1,
  },
  {
    title: 'Resource vs Identity Policies',
    content: POPUP_MSG2,
  },
  {
    title: 'Resource-Based Policy Recap',
    content: POPUP_MSG3,
  },
  {
    title: 'Level Recap',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
];
