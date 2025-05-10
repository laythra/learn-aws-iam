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
    title: 'Time To Add Some Guard Rails 🛡️',
    content: POPUP_MSG1,
  },
  {
    title: 'AWS Accounts and OUs',
    content: POPUP_MSG2,
  },
  {
    title: 'Resource Based Policies',
    content: POPUP_MSG3,
  },
  {
    title: 'Level Recap',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
];
