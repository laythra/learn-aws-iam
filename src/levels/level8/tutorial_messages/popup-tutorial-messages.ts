import { PopupTutorialMessage } from '@/types/tutorial-message-types';
const POPUP_MSG1 = `
  The policies you've created so far were relatively straightforward.
  In this level, you'll write more advanced IAM policies using \`Condition\`.|lg

  ::badge[RULE]:: **Conditions define when a statement applies using request context values,
  operators, and condition keys.**|lg
`;

const POPUP_MSG2 = `
  Here's a quick breakdown of the \`Condition\` element in IAM policies.
  It has three main parts:

  * **Condition Operator**: The operator used to evaluate
  the condition (e.g., \`Bool\`, \`StringEquals\`, etc.)
  * **Condition Key**: The key that the condition evaluates (e.g., \`aws:MultiFactorAuthPresent\`)
  * **Condition Value**: The value that the condition key must match for the policy to apply

  &nbsp;

  ~~~js
  {
    "Version": "2012-10-17", ::badge[POLICY LANGUAGE VERSION]::
    "Statement": [
      {
        "Effect": "Deny", ::badge[DENIES SPECIFIED ACTIONS]::
        "Action": ["*"], ::badge[ALL ACTIONS]::
        "Resource": "*", ::badge[ALL AWS RESOURCES]::
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

  Notice the \`Condition\` element in the statement.
  The operator \`Bool\` checks whether a condition is either true or false.
  In this example, the policy denies all actions on all resources
  if **Multi-Factor Authentication (MFA)** is not enabled for the principal.
`;

const POPUP_MSG5 = `
  Congratulations on completing Level 8! 🎉|xl

  You learned how to create more sophisticated IAM policies
  using conditions to restrict access based on user attributes.
  You also got a glimpse of **Tag-Based Access Control (TBAC)**.|lg

  This is just the start of conditions and tags.
  You'll go deeper into these concepts in the next levels.|lg
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
