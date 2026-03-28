import { PopupTutorialMessage } from '@/types/tutorial-message-types';

const POPUP_MSG1 = `
  We've covered great ground so far! We got to learn about:
  * **IAM Users** - Entities that can interact with AWS services, like humans or applications
  * **IAM Groups** - Entities that encapsulate multiple users that share the same permissions
  * **IAM Policies** - JSON documents that define permissions, attached to users or groups

  &nbsp;

  We'll now explore **IAM Roles**—temporary identities that define
  a set of permissions for making AWS service requests.
`;

const POPUP_MSG2 = `
Unlike **IAM Users** or **Groups**, roles aren’t permanently assigned to a specific entity.
Instead, they are **temporarily assumed** by trusted principals
like **IAM Users**, **applications**, or **AWS services**.

::badge[RULE]:: **An IAM Role operates using two key policies:**

* **Trust Policy** (embedded in the role) – Specifies **who is allowed to assume** the role.
* **Identity-based Policy** (attached to the role) –
  Specifies **what actions the role can perform** once assumed.

> |color(warning)
> ::badge[WARNING]::
 In order for **IAM Users** to assume a role, not only must the role's trust policy allow it,
 but the user must also have an appropriate identity-based
 policy that allows them to call \`sts:AssumeRole\` on that role.
`;

const POPUP_MSG3 = `
Every **IAM Role** has a **Trust Policy** that defines **who can assume it**.

A **Trust Policy** looks similar to other IAM policies,
but it introduces the **\`Principal\`** element.

Here’s a quick breakdown of a Trust Policy statement:

- **Principal** – The trusted entity that can assume the role
  (for example: an IAM user, role, AWS account, or AWS service).
- **Effect** – Typically \`Allow\`, stating that the principal **can assume** the role.
- **Action** – Usually \`sts:AssumeRole\`.

So the intent is reversed from identity-based policies:
instead of "what can I do?", a Trust Policy answers
"**who can become this role?**"

~~~js
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow", ::badge[THE PRINCIPAL IS ALLOWED TO ASSUME THE ROLE]::
      "Principal": {
        "Service": "ec2.amazonaws.com" ::badge[AWS SERVICE PRINCIPAL]::
      },
      "Action": "sts:AssumeRole" ::badge[THE PRINCIPAL CAN ASSUME THIS ROLE]::
    }
  ]
}|fullwidth
~~~

> **⚠️ Important**
>
> In this level and the ones that follow, when we say "role" in the context
> of who can assume it, we are specifically referring to the role's **Trust Policy**.
>
> In AWS, a role and its trust policy are technically separate concepts.
> For simplicity, we use "role" to refer to both.
`;

const POPUP_MSG4 = `
  We're back at **TimeShift Labs**, where we're integrating a new image processing system
  to generate important metadata for every image users upload.

  &nbsp;

  ##### Here's how the flow works:
  1. The end-user uploads an image to the **S3 Bucket**: \`chat-images\`
      through our web interface, hosted on an Amazon **EC2 instance**.

  2. A **Lambda function** is automatically triggered by the upload event.
    It processes the image and generates metadata, which it then stores elsewhere.

  &nbsp;

  > |color(rule)
  > ::badge[RULE]:: For service-to-service access, you don't call \`sts:AssumeRole\` yourself
  > (like we did with IAM Users previously).
  > Instead, the AWS service assumes its execution role automatically.
  > You just attach the role with the right permissions.
`;

const POPUP_MSG5 = `
  Using **IAM roles** is paramount when it comes to
  establishing Service-To-Service communication inside your AWS account.

  Roles serve more complex use cases. In the upcoming level, we will learn how to use roles for
  establishing cross-account access, where resources from your main AWS account
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
