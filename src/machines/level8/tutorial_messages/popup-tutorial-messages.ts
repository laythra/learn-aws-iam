import { PopupTutorialMessage } from '@/machines/types';
const POPUP_MSG1 = `
  The policies we create so far have been relatively straightforward,
  but as we progress, we’ll need to create more complex policies which mainly involve conditions.|lg


  Conditions allow us to specify when a policy should apply,
  and it supports a wide range of operators and ways to evaluate the conditions.
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

const POPUP_MSG5 = `
  Congratulations on completing Level 8! 🎉

  You have successfully learned how to create more sohisticated IAM policies
  using conditions to restrict access based on user roles and attributes,
  we also got a glimpse of how **Tag Based Access Control (TBAC)** works. |lg

  We're still touching the surface when it comes to writing policies with Conditions and Tags,
  but don't worry, we'll dive deeper into these concepts in the next levels.|lg
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
    title: 'Level 8 completed! 🔥',
    content: POPUP_MSG5,
    go_to_next_level_button: true,
  },
];
