import { ObjectivesApplicableNodesFnName, ValidateFunctionsFnName } from '../level-runtime-fns';
import { FinishEventMap, PolicyEditFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { IAMPolicyEditObjective, ObjectiveType } from '@/machines/types/objective-types';
import { AccessLevel, HandleID, IAMNodeEntity } from '@/types/iam-enums';
import { PolicyGrantedAccess } from '@/types/iam-policy-types';

const OBJECTIVE1_CALLOUT_MSG = `
  We need to edit this policy to ensure only
  Senior users have access to the \`slack-alert-token\` secret.

  This can be achieved using **Conditions**:

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  Consult the hints below if you need further help
`;

const OBJECTIVE1_HINT_MSG1 = `
  For the condition operators, the most commonly used ones are:
  - **\`StringEquals\`**: checks if a string matches a specific value.
  - **\`StringLike\`**: checks if a string matches a pattern (supports wildcards).
  - **\`Bool\`**: evaluates to true or false.
  - **\`NumericEquals\`**: checks if a numeric value matches a specific number.

  For our case, we want to check if username contains \`senior\`,
  what operator is best suited for this?
`;

const OBJECTIVE1_HINT_MSG2 = `
  As for the condition keys, there are thousands of them available.
  Each objective key can represent a different use case.
  The most commonly used ones are:
  - **\`aws:username\`**: checks that the username of the principal
  making the request matches a specific value.
  - **\`aws:userid\`**: checks that the unique identifier of
  the principal making the request matches a specific value.

  which one do you think is best suited for this case?
`;

const OBJECTIVE1_HINT_MSG3 = `
  Condition values can be fixed values, such as "true" or "false".
  We'll cover variables in a later stage, so for now, focus on using fixed values only.

  *Extra Hint: You should use a wildcard (\*) in the value*
`;

const OBJECTIVE2_HINT_MSG1 = `
  Recall the conditition operators we discussed earlier?
  For this objective, using **\`StringLike\`** is spurious,
  as we want to check if the \`role\` tag has a value of \`senior\` strictly.

  What operator do you think is best suited for this case?
`;

const OBJECTIVE2_HINT_MSG2 = `
  What we mainly want to achieve is check if the \`role\` tag has a value of \`senior\`.

  There are multiple Condititon keys  which allow us to operate on tags:
  - **\`aws:RequestTag/<tag-name>\`**: checks the tags associated with the request.
  - **\`aws:ResourceTag/tag-name>\`**: checks the tags associated with the resource.

  Which one do you think is best suited for this case?
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
          path: '/Statement/1/Condition',
          content: 'Condition element to restrict access to seniors',
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
