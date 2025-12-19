import { AccountID } from '../types/node-id-enums';
import { PopupTutorialMessage } from '@/machines/types';

const POPUP_MSG1 = `
  All the policies we've dealt with so far granted permissions
  to users & roles. these policies are known as **Identity-Based Policies**.

  And now that we've touched upon **Cross-Account Access**,
  it's time to dive into **Resource Based Policies**. they will help us achieve
  cross account access without having to create and assume **IAM Roles**.
`;

const POPUP_MSG2 = `
  What's the difference between a **Resource Based Policy** and  an **Identity Based Policy**?
  Well, it's merely the fact that **Resource Based Policies** can be attached to AWS resrouces,
  not just IAM entities.

  They have the same JSON structure as **Identity Based Policies**,
  with the addition of the **Principal** field, which defines the entity that is allowed access.

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
  As you have noticed, a **Resource Based Policy** is merely a normal permission policy
  with the addition of the **Principal** field.

  The **Principal** field defines the entity that is allowed access to the resource,
  and has the same format as the **Principal** field in a **Trust Policy**.
`;

const POPUP_MSG4 = `
  This level covered the basics of **Resource Based Policies** and how they can be used
  to grant access to resources across different AWS accounts.

  Here are the list of policy types we've covered so far:
  - **Identity Based Permission Policies**: attached to IAM entities (users, roles)
  - **Resource Based Trust Policies**: attached to AWS resources (S3 buckets, SNS topics)
  - **Trust Policies**: attached to IAM roles, specifying which entities can assume the role

  The next level will introduce you to a new, powerful
  type of policies called *Permission Boundaries* 🔥.
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Resource Based Policies',
    content: POPUP_MSG1,
  },
  {
    title: 'haha',
    content: POPUP_MSG2,
  },
  {
    title: 'Resource Based Policies Recap',
    content: POPUP_MSG3,
  },
  {
    title: 'Level Recap',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
];
