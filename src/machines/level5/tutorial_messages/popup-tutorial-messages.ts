import { PopupTutorialMessage } from '@/machines/types';

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
Unlike **IAM Users** or **Groups**, roles are not permanently assigned to any entity.
Instead, they are assumed temporarily
by trusted principals such as **IAM Users**, **Applications**, and **AWS Services**.

An IAM Role functions through two policies:

* **Trust Policy** – Defines who can assume the role.
* **Identity-based Policy** – Defines what actions the role can perform once assumed.

This separation makes IAM Roles flexible and secure, allowing controlled, temporary access.
`;

const POPUP_MSG3 = `
Each **IAM role** has a **Trust Policy** that specifies who can assume it.


A **Trust Policy** is merely an **IAM Policy** which follows a specific format.
It defines the trusted entities that can assume the role.
The basic structure of **Trust Policies**
should be easy to digest now that we've covered the basics:
- **Principal**: The entity that is allowed to assume the role. It can be an:
    - AWS service
    - IAM User
    - AWS Account
    - IAM Role (IAM Roles are principals entities too!)

- **Effect**: Whether the \`Principal\` is allowed or denied the access

- **Action**: The action the \`Principal\` is allowed (or denied) to perform,
Usually it's \`sts:AssumeRole\` in the context of **Trust Policies**.
Meaning the principal can assume the role.

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
  We're back at ***Timeshift Labs***, where we're integrating a new simple image processing system
  that's mainly used for generating important metadata related to the images the users upload.|lg


  The end-user will upload the image to the **S3 Bucket**: \`users-certificates\`
  through our web interface that's hosted on an amazon **EC2 instance**,
  and a **Lambda Function** will be notified upon this operation
  and will run to generate important metadata related to the uploaded image.|lg
`;

const POPUP_MSG5 = `
  Using *IAM roles* is paramount when it comes to
  establishing Service-To-Service communication inside your AWS account.

  Roles serve more complex use cases. In the upcoming level, we will learn how to use roles for
  establishing cross account access, where resources from your main AWS account
  can be accessed from users (or even resources) in other accounts or vice-versa!
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
    title: 'IAM Roles Trust Policies',
    content: POPUP_MSG3,
  },
  {
    title: 'Service-to-Service access with IAM Roles',
    content: POPUP_MSG4,
  },
  {
    title: 'Coming up next',
    content: POPUP_MSG5,
    go_to_next_level_button: true,
  },
];
