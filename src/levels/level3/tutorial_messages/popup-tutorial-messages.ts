import { PopupTutorialMessage } from '@/types/tutorial-message-types';

const POPUP_MSG_1 = `
In the previous level, we covered **IAM Groups** and
how they simplify permission management at scale.|lg

This level introduces **Customer Managed IAM Policies** and **AWS Managed Policies**.|lg
`;

const POPUP_MSG_2 = `
In **Level 2**, the pre-built policies you worked with were **AWS Managed**.|lg

* **AWS Managed Policies** are pre-built policies you can attach
 to your IAM \`users\`, \`groups\`, and \`roles\`.
* They're designed to cover common use cases and are maintained by AWS.
* They can't be edited — only attached or detached.

**Customer Managed Policies** are policies you create and manage yourself.|lg

* You create them as \`JSON\` documents and attach them
to your **IAM users**, **groups**, or **roles**.
* They give you more control over permissions since they're fully customized by you.
`;

const POPUP_MSG_3 = `
::badge[RULE]::
Policies — whether **AWS Managed** or **Customer Managed** — have the same structure:

* **Effect**: Whether the policy allows or denies access
* **Action**: The specific actions that the policy allows or denies
* **Resource**: The resources to which the policy applies

~~~js
{
  Version: "2012-10-17",
  Statement: [
    {
      "Effect": "Allow", ::badge[ALLOWS SPECIFIED ACTIONS]::
      "Action": ["s3:Get*", "s3:List*"], ::badge[READ AND LIST S3 RESOURCES]::
      "Resource": "*" ::badge[ALL S3 BUCKETS]::
    }
  ]
}|fullwidth
~~~

>|color(warning) ::badge[WARNING]:: **Deny** takes precedence over **Allow**.
If a user has one policy that allows an action but another policy that denies it,
the action will be denied
`;

const POPUP_MSG_4 = `
You're a DevOps engineer responsible for managing **IAM policies**
 for a small startup.|lg

\\
The company has two teams: **Frontend** and **Backend**.
* **Frontend Team**:
  - Requires ***read/write*** access to specific **S3 buckets**
   for storing static assets (e.g., images).
  - Needs read access to specific **CloudFront Distributions**
   to view distribution configuration.
* **Backend Team**:
  - Requires ***read/write*** access to specific **DynamoDB** tables.
`;

const POPUP_MSG_5 = `
**Important note:** Backend developers sometimes need access
to the same \`S3\` buckets that frontend developers use.|lg

::badge[RULE]::
Ensure you create reusable policies
while maintaining the **principle of least privilege**.|lg

&nbsp;

> |color(blue)
> **What is the Principle of Least Privilege?**|lg
>
> The **principle of least privilege** means giving users or systems only the permissions
> they need to do their job - nothing more. For example,
> a database admin might need access to read financial records,
> but shouldn't be able to modify them unless that's explicitly part of their role.
> This isn't an IAM concept - it's a general security principle.
`;

const POPUP_MSG_6 = `
Your teams now have the proper permissions to access the resources they need,
and the principle of least privilege is being followed.|lg

This level reinforced everything we've covered so far.
In the next level, we'll start editing customer managed policies
to fine-tune the permissions you need.|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Level 3: A Dive into IAM Policies',
    content: POPUP_MSG_1,
  },
  {
    title: 'Customer Managed Policies',
    content: POPUP_MSG_2,
  },
  {
    title: 'Policies Structure',
    content: POPUP_MSG_3,
  },
  {
    title: 'Your task as a DevOps engineer 👨‍💻️',
    content: POPUP_MSG_4,
  },
  {
    title: 'Your task as a DevOps engineer 👨‍💻',
    content: POPUP_MSG_5,
  },
  {
    title: 'Level 3 completed! 🔥',
    content: POPUP_MSG_6,
    go_to_next_level_button: true,
  },
];
