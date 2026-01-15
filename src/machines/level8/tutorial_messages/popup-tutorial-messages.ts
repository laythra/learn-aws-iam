import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';
const POPUP_MSG1 = `
  Up to now, policies were pretty straightforward.
  Next step: **conditions**—the real power move.|lg

  Conditions let a policy apply *only when* certain rules are met.
`;

const POPUP_MSG2 = `
  A quick tour of the \`Condition\` block. It has three parts:

  * **Operator**: how to evaluate (\`Bool\`, \`StringEquals\`, etc.)
  * **Key**: what you’re checking (e.g., \`aws:MultiFactorAuthPresent\`)
  * **Value**: what it must match

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

  Here, access is denied unless **MFA** is enabled.
`;

const POPUP_MSG5 = `
  Level 8 complete! 🎉|lg

  You learned how to build policies with **conditions** and got a taste of
  **Tag-Based Access Control (TBAC)**.|lg

  We’re just getting started—next levels go deeper into conditions and tags.|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Time to get serious about complex policies',
    content: POPUP_MSG1,
  },
  {
    title: 'Conditions in IAM policies',
    content: POPUP_MSG2,
  },
  {
    title: 'Level 8 completed! 🔥',
    content: POPUP_MSG5,
    go_to_next_level_button: true,
  },
];
