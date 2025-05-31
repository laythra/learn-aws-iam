import { PopupTutorialMessage } from '@/machines/types';
const POPUP_MSG1 = `

  We will dive into a simply yet very powerful concept called **Tag Based Access Control**.|lg

  But before that, we need to introduce a new simple concept called **Tags**.|lg

  Tags are key-value pairs that you can assign to most AWS resources,
  this includes IAM entities like \`users\`, \`groups\`, \`roles\`, and \`policies\`.|lg
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
  with the addition of the \`Condition\`
  element, which allows you to add conditions to your policies.
`;

const POPUP_MSG4 = `
  Here's a quick dive into the \`Condition\` element in IAM Policies,
  it consists of three main parts:

  * **Condition Operator**: The operator used to evaluate
  the condition (e.g., \`Bool\`, \`StringEquals\`, etc.)
  * **Condition Key**: The key that the condition evaluates (e.g., \`aws:MultiFactorAuthPresent\`)
  * **Condition Value**: The value that the condition key must match for the policy to apply

  &nbsp;

  ~~~js
  {
    Version: "2012-10-17",
    Statement: [
      {
        "Effect": "Deny", ::badge[DENIES SPECIFIED ACTIONS]::
        "Action": ["*"], ::badge[ALL ACTIONS]::
        "Resource": "*" ::badge[ALL AWS RESOURCES]::
        "Condition": {
          "Bool": { ::badge[CONDITION OPERATOR]::
            "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
          }
        }
      }
    ]
  }|fullwidth
  ~~~

  &nbsp;

  Notice the \`Condition\` element at the end of the policy.
  The operator \`Bool\` checks whether a condition is either true or false.
  In this case, the policy denies access to all actions and resources
  if **Multi-Factor Authentication (MFA)** is not enabled for the principal.
`;

const POPUP_MSG5 = `
  SCPs come in quite handy when you want to enforce
  certain restrictions across multiple accounts or OUs.
  They allow you to set policies that apply at the account or OU level.

  This level covered a handful of essential concepts:
  - **AWS Accounts**: Containers for your resources and IAM entities.
  - **Organizational Units (OUs)**: Grouping multiple AWS accounts for better management.
  - **Service Control Policies (SCPs)**: Guardrails that apply to accounts and OUs
  - **Condition Element**: Adds conditions to your policies for more granular control.

  The upcoming level will continue upon these concepts,
  but we will start applying condititions more effectively
  using something called **Tag Based Access Control (TBAC)**.

  See you there! 👋
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Tags in AWS IAM 🏷️',
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
  },
  {
    title: 'Level 8 completed! 🔥',
    content: POPUP_MSG5,
    go_to_next_level_button: true,
  },
];
