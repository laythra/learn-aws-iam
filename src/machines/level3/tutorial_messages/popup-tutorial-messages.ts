import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPUP_MSG_1 = `
Last level: **IAM Groups** and why they scale so well.|lg

This level is all about **Customer Managed Policies** vs **AWS Managed Policies**.|lg
`;

const POPUP_MSG_2 = `
Everything so far was **AWS Managed**.|lg

* **AWS Managed Policies** are prebuilt by AWS.
* You can attach or detach them, but you can’t edit them.
* They’re meant for common use cases.

**Customer Managed Policies** are written and owned by *you*.|lg

* They’re JSON documents you create.
* You can attach them to **users**, **groups**, or **roles**.
* They give you fine-grained control.
`;

const POPUP_MSG_3 = `
*Policies whether **AWS Managed** or **Customer Managed** have the same structure:

* **Effect**: Whether the policy allows or denies the access
* **Action**: The specific actions that the policy allows or denies
* **Resource**: The resources to which the policy applies

&nbsp;

~~~js
{
  Version: "2012-10-17",
  Statement: [
    {
      "Effect": "Allow", ::badge[ALLOWS SPECIFIED ACTIONS]::
      "Action": ["s3:Get*", "s3:List*"], ::badge[LIST & READ S3]::
      "Resource": "*" ::badge[ALL S3 BUCKETS]::
    }
  ]
}|fullwidth
~~~
`;

const POPUP_MSG_4 = `
You’re the DevOps engineer managing policies for a tiny startup.|lg

The company has two teams: **Frontend** and **Backend**.
* **Frontend** needs *read/write* access to specific **S3 buckets** for assets.
* They also need *read* access to **CloudFront distributions** for monitoring.
* **Backend** needs full access to certain **DynamoDB tables**.
`;

const POPUP_MSG_5 = `
One more thing: backend devs sometimes (not necessarily in this level)
need access to the same **S3 buckets** as frontend.|lg

Build policies that are reusable while sticking to **least privilege**.|lg

**Least privilege** means giving only the access needed to do the job,
no more, no less. It’s a core security best practice you'll use throughout IAM.|lg
`;

const POPUP_MSG_6 = `
Nice work! The teams now have the access they need, without overexposure.|lg

This level recap’d a lot. Next up, you’ll start editing customer managed policies
to get the exact permissions you want.|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Level 3: A dive into IAM policies',
    content: POPUP_MSG_1,
  },
  {
    title: 'Customer managed policies',
    content: POPUP_MSG_2,
  },
  {
    title: 'Policy structure',
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
