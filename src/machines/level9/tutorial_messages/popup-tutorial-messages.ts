import { PopupTutorialMessage } from '@/machines/types';
const POPUP_MSG1 = `
  We got a breif introduction to **Tag Based Access Control (TBAC)** in the last level,
  we'll now dive even deeper into utilizing **Tags** and **Conditions** in IAM Policies.

  This time, we'll also use something called ***Policy Variables***,
  which are placeholders that get replaced with actual values when the policy is evaluated.
`;

const POPUP_MSG2 = `
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

const POPUP_MSG3 = `
  Great job! You've completed the level! 🔥

  We've covered more ground on **Tag Based Access Control (TBAC)**,
  and we are swiftly gaining more confidence in creating complex IAM policies.

  The next level will hone our policy creation skills even further,
  as we will be utilizing what's called **Request Tags** to manage access control,
  and allow teams to move faster and more efficiently.
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Time to get serious about creating complex policies',
    content: POPUP_MSG1,
  },
  {
    title: 'Conditions in IAM Policies',
    content: POPUP_MSG2,
  },
  {
    title: 'Level 9 completed! 🔥',
    content: POPUP_MSG3,
    go_to_next_level_button: true,
  },
];
