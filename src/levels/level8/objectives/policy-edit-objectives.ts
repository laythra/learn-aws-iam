import { ObjectivesApplicableNodesFnName, ValidateFunctionsFnName } from '../level-runtime-fns';
import { FinishEventMap, PolicyEditFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { IAMPolicyEditObjective, ObjectiveType } from '@/levels/types/objective-types';
import { AccessLevel, HandleID, IAMNodeEntity } from '@/types/iam-enums';
import { PolicyGrantedAccess } from '@/types/iam-policy-types';

const OBJECTIVE1_CALLOUT_MSG = `
  Edit this policy so only senior users can access
  the \`slack-alert-token\` secret.

  Use a **Condition**:

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  Use the hints below if needed.
`;

const OBJECTIVE1_HINT_MSG1 = `
  For the condition operators, the most commonly used ones are:
  - **\`StringEquals\`**: checks if a string matches a specific value.
  - **\`StringLike\`**: checks if a string matches a pattern (supports wildcards).
  - **\`Bool\`**: evaluates to true or false.
  - **\`NumericEquals\`**: checks if a numeric value matches a specific number.

  For this objective, we need to match usernames that start with \`senior-\`.
  Which operator is best for wildcard matching?
`;

const OBJECTIVE1_HINT_MSG2 = `
  There are many condition keys, and each serves a different purpose.
  The most commonly used ones are:
  - **\`aws:username\`**: checks that the username of the principal
  making the request matches a specific value.
  - **\`aws:userid\`**: checks that the unique identifier of
  the principal making the request matches a specific value.

  Which key is best for this case?
`;

const OBJECTIVE1_HINT_MSG3 = `
  Condition values can be fixed values, such as "true" or "false".
  We'll cover variables in a later stage, so for now, focus on using fixed values only.

  **Extra Hint: You should use a wildcard (\`*\`) in the value**
`;

const OBJECTIVE2_HINT_MSG1 = `
  Recall condition operators from earlier.
  For this objective, **\`StringLike\`** is unnecessary
  because we need an exact match for \`role = senior\`.

  Which operator is best here?
`;

const OBJECTIVE2_HINT_MSG2 = `
  We need to verify that the calling principal has \`role = senior\`.

  Common tag-related condition keys include:
  - **\`aws:PrincipalTag/<tag-name>\`**: checks tags on the calling principal.
  - **\`aws:RequestTag/<tag-name>\`**: checks tags passed in the API request.
  - **\`aws:ResourceTag/<tag-name>\`**: checks tags on the target resource.

  Since users are tagged in this level, which key should you use?
`;
const GRANTED_RESOURCES: PolicyGrantedAccess<ObjectivesApplicableNodesFnName>[] = [
  {
    access_level: AccessLevel.Read,
    target_node: ResourceNodeID.SlackIntegrationSecret,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
    applicable_nodes_fn_name: 'seniorUsersApplicableNodes',
  } satisfies PolicyGrantedAccess<ObjectivesApplicableNodesFnName>,
  {
    access_level: AccessLevel.Read,
    target_node: ResourceNodeID.SlackCrashlyticsNotifierService,
    source_handle: HandleID.Top,
    target_handle: HandleID.Bottom,
  },
];

export const POLICY_EDIT_OBJECTIVES: IAMPolicyEditObjective<
  FinishEventMap,
  ValidateFunctionsFnName
>[][] = [
  [
    {
      id: PolicyNodeID.SlackServiceManagePolicy,
      type: ObjectiveType.POLICY_EDIT_OBJECTIVE,
      validate_fn_name: 'slackManagePolicyValidateFn1',
      entity: IAMNodeEntity.Policy,
      callout_message: OBJECTIVE1_CALLOUT_MSG,
      on_finish_event: PolicyEditFinishEvent.SLACK_SERVICE_MANAGE_POLICY_EDITED_FIRST_TIME,
      resources_to_grant: GRANTED_RESOURCES,
      hint_messages: [
        {
          title: 'Condition Operators',
          content: OBJECTIVE1_HINT_MSG1,
        },
        {
          title: 'Condition Keys',
          content: OBJECTIVE1_HINT_MSG2,
        },
        {
          title: 'Condition Values',
          content: OBJECTIVE1_HINT_MSG3,
        },
      ],
      help_badges: [
        {
          path: '/Statement/1',
          content: 'Add a condition to this statement to restrict access to senior users only',
          color: 'yellow',
        },
      ],
      finished: false,
    },
  ],
  [
    {
      id: PolicyNodeID.SlackServiceManagePolicy,
      type: ObjectiveType.POLICY_EDIT_OBJECTIVE,
      validate_fn_name: 'slackManagePolicyValidateFn2',
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyEditFinishEvent.SLACK_SERVICE_MANAGE_POLICY_EDITED_SECOND_TIME,
      resources_to_grant: GRANTED_RESOURCES,
      hint_messages: [
        {
          title: 'Condition Operator',
          content: OBJECTIVE2_HINT_MSG1,
        },
        {
          title: 'Condition Keys for Tags',
          content: OBJECTIVE2_HINT_MSG2,
        },
      ],
      finished: false,
    },
  ],
];
