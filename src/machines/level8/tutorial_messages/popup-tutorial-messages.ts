import { PopupTutorialMessage } from '@/machines/types';
const POPUP_MSG1 = `
  Everything we've been covering so far had to do with how to ***grant*** access to iam entities.|lg

  Now, we'll be covering how to add some protective measures to your AWS resources
  to prevent accidental access or simply guard against unwanted access more effectively.|lg
`;

const POPUP_MSG2 = `
  This level might feel a little different from the ones before.

  But before we dive in, we need to cover a couple of essential AWS concepts.
  Don’t worry—they’re simple, and everything will make sense once you see the canvas.

  In AWS, two key concepts form the foundation of access management:

  - ***AWS Accounts***: Think of these as containers.
  Each account has its own resources and IAM entities, isolated from others.

  - ***Organizational Units (OUs)***: These let you group multiple AWS accounts
  under a common structure. For example, you might create an OU
  for each department in your company—like Engineering or
  Marketing—and inside each OU, you could have separate
  AWS accounts for staging and production environments.

  Let’s go over them visually—it’ll click in no time.
`;

const POPUP_MSG3 = `
  Service Control Policies (SCPs) are quite identical to
  IAM policies in terms of syntax and structure.
  The main difference is that SCPs act as guardrails for
  your AWS accounts and organizational units (OUs),

  The next part of the level will be quite similar to the previous one,
  with the addition of the \`condition\`
  element, which allows you to add conditions to your policies.
`;

const POPUP_MSG4 = `
  Policies whether **AWS Managed** or **Customer Managed** have the same structure:

  * **Effect**: Whether the policy allows or denies the access
  * **Action**: The specific actions that the policy allows or denies
  * **Resource**: The resources to which the policy applies

  ~~~js
  {
    Version: "2012-10-17",
    Statement: [
      {
        "Effect": "Allow", ::badge[ALLOWS SPECIFIED ACTIONS]::
        "Action": ["s3:Get*", "s3:List*"], ::badge[LISTING ALL OBJECTS AND BUCKETS]::
        "Resource": "*" ::badge[ALL S3 BUCKETS]::
      }
    ]
  }|fullwidth
  ~~~
`;

const POPUP_MSG5 = `
  SCPs come in quite handy when you want to enforce
  certain restrictions across multiple accounts or OUs.
  They allow you to set policies that apply at the account or OU level.

  This level covered a handful of essential concepts:
  - **AWS Accounts**: Containers for your resources and IAM entities.
  - **Organizational Units (OUs)**: Grouping multiple AWS accounts for better management.
  - **Service Control Policies (SCPs)**: Guardrails that apply to accounts and OUs

  The upcoming level will continue upon these concepts, where we will apply our SCPs
  knownledge with something called **Tag Based Access Control**.

  See you there! 👋
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Time To Add Some Guard Rails 🛡️',
    content: POPUP_MSG1,
  },
  {
    title: 'AWS Accounts and OUs',
    content: POPUP_MSG2,
  },
  {
    title: 'Adding guard rails on the account level',
    content: POPUP_MSG3,
  },
  {
    title: 'Conditional Policies',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
  {
    title: 'Level Recap',
    content: POPUP_MSG5,
    go_to_next_level_button: true,
  },
];
