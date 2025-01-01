import { PopupTutorialMessage } from '@/machines/types';

const POPUP_MSG1 = `
  We've covered great ground so far! We got learn about:|lg
  * **IAM Users** - Entities that can interact with AWS services, like humans or applications
  * **IAM Groups** - Entities that encapsulate multiple users that share the same permissions
  * **IAM Policies** - JSON documents that define permissions, attached to users or groups
`;

const POPUP_MSG2 = `
  We'll now learn about **IAM Roles**: entities that define a set of permissions
  for making AWS service requests.

  Roles are not permanently associated with a specific user or group, unlike policies,
  but are rather temporarily assumed by trusted entities,
  such as IAM users, applications, and AWS services.
`;

const POPUP_MSG3 = `
Each \`IAM role\` has a **trust policy** that specifies who can assume it.


A **trust policy** is a JSON document that defines the trusted entities that can assume the role.
The basic structure of *IAM roles* should be easy to digest now that we've covered the basics:
* **Principal**: The entity that is allowed to assume the role. It can be an AWS service,
a regular IAM user or even an AWS account
* **Effect**: Whether the principal is allowed or denied the access
* **Action**: The action the pricipal is allowed to perform, it's almost always \`sts:AssumeRole\`

~~~js
{
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow', ::badge[ALLOWS THE PRINCIPAL TO ASSUME THIS ROLE]::
      Principle: {
        Service: 's3.amazonaws.com', ::badge[THE PRINCIPAL HERE IS ANY S3 BUCKET]::
      },
      Action: 'sts:AssumeRole', ::badge[THE PRINCIPAL CAN ASSUME THIS ROLE]::
    },
  ],
}|fullwidth,
~~~
`;

const POPUP_MSG4 = `
  You might be curious about the distinction between granting access to a user
  via an **IAM role** versus using a traditional **IAM policy**.

  There are a few key differences that are too boring to list here, but here's a summary:
  * **IAM Roles** provide temporary credentials to trusted entities,
  unlike policies which are permanently attached
  * **IAM Roles** solve use cases not possible with policies,
  like cross-account access, or service-to-service access

  For this part of the level, we'll using **IAM roles** to establish service-to-service access.
`;

const POPUP_MSG5 = `
  We're back at ***Timeshift Labs***, where we're integrating a new simple image processing system
  that's mainly used for generating important metadata related to the images the users upload.|lg


  The end-user will upload the image to the **S3 Bucket**: \`users-certificates\`
  through our web interface that's hosted on an amazon **EC2 instance**,
  and a **Lambda Function** will be notified upon this operation
  and will run to generate important metadata related to the uploaded image.|lg
`;

const POPUP_MSG6 = `
  As the IAM security Specialist as ***Timeshift Labs***,
  You are faced with the following challenges:

  * We need to grant the **EC2 instance** the required access to write into the S3 bucket
  * We need to grant the **Lambda Function** the required access read from the S3 bucket

  Using regular IAM policies won't work here, and as usual,
  you'll find the list of objectives in the right side panel 👉

  Good Luck!
`;

const POPUP_MSG7 = `
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
    title: 'IAM Roles vs Policies',
    content: POPUP_MSG4,
  },
  {
    title: 'Service-to-Service access with IAM Roles',
    content: POPUP_MSG5,
  },
  {
    title: 'Your Mission',
    content: POPUP_MSG6,
  },
  {
    title: 'Coming up next',
    content: POPUP_MSG7,
  },
];
