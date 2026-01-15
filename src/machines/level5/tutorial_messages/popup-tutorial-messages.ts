import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPUP_MSG1 = `
  Quick recap:|lg
  * **IAM Users** — people/apps that call AWS services
  * **IAM Groups** — collections of users with shared access
  * **IAM Policies** — JSON rules that grant permissions

  &nbsp;

  Now we’re getting into **IAM Roles**—temporary identities for making AWS requests.|lg
`;

const POPUP_MSG2 = `
Roles aren’t tied to a single user or group.
They’re **assumed temporarily** by trusted principals like **users**, **apps**, or **AWS services**.

Every role has two key policies:

* **Trust Policy** — who *can* assume the role.
* **Permissions Policy** — what the role *can do* once assumed.

That split keeps access flexible *and* secure.
`;

const POPUP_MSG3 = `
Every role includes a **Trust Policy** that says **who can assume it**.

It uses the same policy language you’ve seen before—
**Effect**, **Action**, **Statement**—but adds a new field: **\`Principal\`**.

Why? Because permission policies already imply the principal
(the entity they’re attached to). Trust policies have to *declare* it.

Quick breakdown:

- **Principal** — who can assume the role (service, user, role, or account)
- **Effect** — usually \`Allow\`
- **Action** — typically \`sts:AssumeRole\`

So instead of “what can I do?”, a trust policy answers:
**“who do I trust to become me?”**

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
  Back at *TimeShift Labs*, we’re adding an image processing system.

  &nbsp;

  ##### Here’s the flow:
  1. A user uploads an image to the **S3 bucket** \`chat-images\`
     through a web app on an **EC2 instance**.

  2. A **Lambda function** triggers on upload, processes the image,
     and stores metadata elsewhere.
`;

const POPUP_MSG5 = `
  **IAM Roles** are the key to safe service-to-service access.|lg

  Next level, we’ll use roles for **cross-account access**, so resources
  in one account can be accessed from another.|lg

  &nbsp;

  **Nice work finishing Level 5—keep it up!** 🚀
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'What we learned so far',
    content: POPUP_MSG1,
  },
  {
    title: 'IAM Roles',
    content: POPUP_MSG2,
  },
  {
    title: "Trust policies and the 'Principal' element",
    content: POPUP_MSG3,
  },
  {
    title: 'Service-to-service access with IAM roles',
    content: POPUP_MSG4,
  },
  {
    title: 'Coming up next 🚀',
    content: POPUP_MSG5,
    go_to_next_level_button: true,
  },
];
