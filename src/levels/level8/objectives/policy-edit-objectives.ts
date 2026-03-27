import { ObjectivesApplicableNodesFnName, ValidateFunctionsFnName } from '../level-runtime-fns';
import { FinishEventMap, PolicyEditFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { AccessLevel, HandleID, IAMNodeEntity } from '@/types/iam-enums';
import { PolicyGrantedAccess } from '@/types/iam-policy-types';
import { IAMPolicyEditObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE1_CALLOUT_MSG = `
  Edit this policy so only senior users can access
  the \`slack-integration-secret\` secret.

  Use a **Condition** on the **SecretsManager statement**:

  ~~~js
  "Condition": {
    "StringEquals": { ::badge[CONDITION OPERATOR]::
      "aws:PrincipalArn": ["arn:aws:iam::..."] ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  Use the hints below if needed.
`;

const OBJECTIVE1_HINT_MSG1 = `
  For exact matching, the most commonly used condition operators are:
  - **\`StringEquals\`**: checks if a string exactly matches a value — works great for ARNs too.
  - **\`ArnEquals\`**: ARN-specific variant of \`StringEquals\`,
  functionally identical for exact matches.

  For this objective, you need to explicitly list the ARNs of the senior developers.
`;

const OBJECTIVE1_HINT_MSG2 = `
  For ARN-related condition keys:
  - **\`aws:PrincipalArn\`**: checks the ARN of the principal making the request.
  - **\`aws:SourceArn\`**: checks the source ARN for service-to-service calls.

  The senior developers are **senior-sam** and **senior-jordan**.
  Which key identifies the calling principal by ARN?
`;

const OBJECTIVE1_HINT_MSG3 = `
  IAM user ARNs follow this format:
  \`arn:aws:iam::<account-id>:user/<username>\`

  The account ID is \`123456789012\`.
  List both senior developer ARNs as an array in the condition value.
`;

const OBJECTIVE2_HINT_MSG1 = `
  Recall ***condition operators*** from earlier. We will need to use something similar here.
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
      entity: IAMNodeEntity.IdentityPolicy,
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
      entity: IAMNodeEntity.IdentityPolicy,
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
