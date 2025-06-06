import { PopupTutorialMessage } from '@/machines/types';

const POPUP_MSG_1 = `
In the previous level, we covered **IAM Groups** and
how they are quite simple yet quite powerful in terms of enhancing permissions management scale|lg

This level will tackle **Customer Managed IAM Policies** and **AWS Managed Policies**.|lg
`;

const POPUP_MSG_2 = `
Every policy we have used so far was **AWS Managed**|lg

* **AWS Managed Policies** are pre-built policies that you can attach
 to your IAM \`users\`, \`groups\`, and \`roles\`.
* They are designed to cover common use cases and are maintained by AWS.
* They cannot be edited, only attached or detached.

**Customer Managed Policies** are policies that you create and manage yourself.|lg

* You create them as \`JSON\` documents and attach them
to your **IAM users**, **groups**, or **roles**.
* They give you more control over the permissions you grant as they are customized by you.
`;

const POPUP_MSG_3 = `
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

const POPUP_MSG_4 = `
You are a DevOps engineer responsible for managing the **IAM policies**
 for the tiny startup you work at.|lg

\\
The company you work for has only two teams, the **Frontend** and **Backend** teams.
* **Frontend Team**:
  - Requires ***read/write*** access to specific **S3 buckets**
   for storing static assets, ie., images.
  - They also require a read access to specific **CloudFront Distributions** for monitoring the
assets content delivery.
* **Backend Team**:
  * Requires full access access to specific **DynamoDB** tables
`;

const POPUP_MSG_5 = `
**Important thing to note:** We sometimes need to give backend developers access
to the same \`S3\` Buckets that frontend developers have access to.|lg

Ensure that you create policies that are reusable
while maintaining the **principle of least privilege**.|lg

The **principle of least privilege** means giving users or systems
the minimum access they need to perform their tasks,
such as allowing a database administrator to view
but not modify financial records unless their job specifically requires it.
It's not an IAM exclusive concept, but rather a security best practice.
`;

const POPUP_MSG_6 = `
Your team now has the proper permissions to access the resources they need
and the principle of least privilege is being followed.|lg

This level was a refreshing overview of everything we've covered so far.
In the upcoming level, we will start editing customer managed policies
to achieve the desired permissions setup we want|lg
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
