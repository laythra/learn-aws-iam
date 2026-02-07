import { PopupTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPUP_MSG1 = `
  We've covered great ground so far! We got learn about:|lg
  * **IAM Users** - Entities that can interact with AWS services, like humans or applications
  * **IAM Groups** - Entities that encapsulate multiple users that share the same permissions
  * **IAM Policies** - JSON documents that define permissions, attached to users or groups

  &nbsp;

  We'll now explore **IAM Roles**—temporary identities that define
  a set of permissions for making AWS service requests.|lg
`;

const POPUP_MSG2 = `
Unlike **IAM Users** or **Groups**, roles aren’t permanently assigned to a specific entity.
Instead, they are **temporarily assumed** by trusted principals
like **IAM Users**, **applications**, or **AWS services**.

An IAM Role operates using two key policies:

* **Trust Policy** – Specifies **who is allowed to assume** the role.
* **Permissions Policy** – Specifies **what actions the role can perform** once assumed.

This separation of responsibilities makes roles both flexible and secure,
enabling *controlled, time-limited access* to AWS resources.
`;

const POPUP_MSG3 = `
Every **IAM Role** has a **Trust Policy** that defines **who can assume it**.

A **Trust Policy** uses the **same IAM policy language** you're already familiar with —
statements, actions, effects — but with one key difference:
it introduces the **\`Principal\`** element.

Why is this new field needed?

Regular **permission policies** (like those attached to users or groups) don't need a \`Principal\`,
because it's **implicitly understood** — the principal is the entity the policy is attached to.

But a **Trust Policy** is evaluated from the *role's* perspective.
It must explicitly state **which entities (principals)** are trusted to assume it.

Here’s a quick breakdown of a Trust Policy statement:

- **Principal** – The entity allowed to assume the role. This could be an:
  - AWS Service
  - IAM User
  - IAM Role (a role can assume another role, it's called role-chaining but we won't cover it here)
  - AWS Account

- **Effect** – Typically \`Allow\`, stating that the principal **can assume** the role.

- **Action** – Usually \`sts:AssumeRole\`, indicating the action
the principal is allowed to perform.

So while the structure mirrors what you've seen before,
the **intent is reversed**: instead of saying "what can I do?",
a Trust Policy says "**who do I trust to become me?**"

  ~~~js
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow", ::badge[THE PRINCIPAL IS ALLOWED TO ASSUME THE ROLE]::
        "Principal": {
        ::badge[THE PRINCIPAL IS AN AWS SERVICE, MAINLY S3 BUCKETS]::
          "Service": "s3.amazonaws.com"
        },
        "Action": "sts:AssumeRole", ::badge[THE PRINCIPAL CAN ASSUME THIS ROLE]::
      },
    ],
  }|fullwidth,
  ~~~
`;

const POPUP_MSG4 = `
  We're back at ***Timeshift Labs***, where we're integrating a new image processing system
  to generate important metadata for every image users upload.

  &nbsp;

  ##### Here's how the flow works:
  1. The end-user uploads an image to the **S3 Bucket**: \`chat-images\`
      through our web interface, hosted on an Amazon **EC2 instance**.

  2. A **Lambda function** is automatically triggered by the upload event.
    It processes the image and generates metadata, which it then stores elsewhere.
`;

const POPUP_MSG5 = `
  Using *IAM roles* is paramount when it comes to
  establishing Service-To-Service communication inside your AWS account.|lg

  Roles serve more complex use cases. In the upcoming level, we will learn how to use roles for
  establishing cross account access, where resources from your main AWS account
  can be accessed from users (or even resources) in other accounts or vice-versa!|lg

  &nbsp;

  ***Oh, and great job completing Level 5! You're doing amazing so far*** 🚀
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'What We Learned So Far',
    content: POPUP_MSG1,
  },
  {
    title: 'IAM Roles',
    content: POPUP_MSG2,
  },
  {
    title: "Trust Policies and the 'Principal' Element",
    content: POPUP_MSG3,
  },
  {
    title: 'Service-to-Service access with IAM Roles',
    content: POPUP_MSG4,
  },
  {
    title: 'Coming up next 🚀',
    content: POPUP_MSG5,
    go_to_next_level_button: true,
  },
];
