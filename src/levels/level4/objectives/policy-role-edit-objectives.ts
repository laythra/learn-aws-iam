import { ValidateFunctionsFnName } from '../level-runtime-fns';
import { FinishEventMap, PolicyEditFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { AccessLevel, IAMNodeEntity } from '@/types/iam-enums';
import { IAMPolicyEditObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE_CALLOUT_MSG = `
  IAM covers hundreds of actions across AWS services.
  We'll focus on the most commonly used ones here.
  To explore the full list, check [here](https://github.com/TryTryAgain/aws-iam-actions-list/blob/master/all-actions.txt).
`;

const OBJECTIVE_CALLOUT_MSG2 = `
  ::badge[ADVANCED]::
  This policy uses the \`Condition\` key, which we haven't covered yet.
  It restricts when a policy takes effect — in this case,
  it denies all actions if the user isn't authenticated with MFA.
`;

const OBJECTIVE1_HINT_MSG1 = `
  Developers should:
  - Have *read/write* access to the \`customer-data\` **DynamoDB Table**.
  - Have *read/write* access to the \`timeshift-assets\` **S3 Bucket** objects.
`;

const OBJECTIVE1_HINT_MSG2 = `
  The first statement targeting the **DynamoDB Table** is too permissive.
  It should only grant read/write access to the \`customer-data\` table.
`;

const OBJECTIVE1_HINT_MSG3 = `
  The second statement targeting the \`timeshift-assets\` **S3 Bucket** looks correct
  at first glance, but there's a subtle issue
  — it's targeting the bucket itself, not the objects inside it.
`;

const OBJECTIVE1_HINT_MSG4 = `
  The actions needed for *read/write* access to a DynamoDB table are:
  - \`dynamodb:GetItem\`
  - \`dynamodb:PutItem\`
  - \`dynamodb:Scan\`
  - \`dynamodb:Query\`
`;

const OBJECTIVE2_HINT_MSG1 = `
  Data Scientists should:
  - Have *read/write* access to the \`AnalyticsData\` **DynamoDB Table**.
  - Have *read/write* access to the \`timeshift-assets\` **S3 Bucket** objects.
`;

const OBJECTIVE2_HINT_MSG2 = `
  ::badge[WARNING]::
  The resource is using a wildcard (\`*\`), making the policy far too permissive.
`;

const OBJECTIVE2_HINT_MSG3 = `
  A statement is missing from this policy.
  It should grant read/write access to the \`timeshift-assets\` **S3 Bucket** objects.
`;

const OBJECTIVE3_HINT_MSG1 = `
  Interns should:
  - Have *read-only* access to the \`timeshift-assets\` **S3 Bucket** objects.
`;

const OBJECTIVE3_HINT_MSG2 = `
  ::badge[WARNING]::
  Something in the policy is preventing the read access statement from taking effect.
`;

export const POLICY_EDIT_OBJECTIVES: IAMPolicyEditObjective<
  FinishEventMap,
  ValidateFunctionsFnName
>[][] = [
  [
    {
      id: PolicyNodeID.DeveloperPolicy,
      validate_fn_name: PolicyNodeID.DeveloperPolicy,
      type: ObjectiveType.POLICY_EDIT_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      callout_message: OBJECTIVE_CALLOUT_MSG,
      on_finish_event: PolicyEditFinishEvent.DEVELOPER_POLICY_EDITED,
      resources_to_grant: [
        {
          access_level: AccessLevel.Read,
          target_node: ResourceNodeID.TimeshiftAssetsS3Bucket,
          target_handle: 'bottom',
          source_handle: 'top',
        },
        {
          access_level: AccessLevel.ReadWrite,
          target_node: ResourceNodeID.CustomerDataDynamoTable,
          target_handle: 'bottom',
          source_handle: 'top',
        },
      ],
      hint_messages: [
        {
          title: 'Level Objective',
          content: OBJECTIVE1_HINT_MSG1,
        },
        {
          title: 'Hint #1',
          content: OBJECTIVE1_HINT_MSG2,
        },
        {
          title: 'Hint #2',
          content: OBJECTIVE1_HINT_MSG3,
        },
        {
          title: 'Hint #3',
          content: OBJECTIVE1_HINT_MSG4,
        },
      ],
      finished: false,
    },
    {
      id: PolicyNodeID.DataScientistPolicy,
      validate_fn_name: PolicyNodeID.DataScientistPolicy,
      type: ObjectiveType.POLICY_EDIT_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyEditFinishEvent.DATA_SCIENTIST_POLICY_EDITED,
      callout_message: OBJECTIVE_CALLOUT_MSG,
      resources_to_grant: [
        {
          access_level: AccessLevel.ReadWrite,
          target_node: ResourceNodeID.TimeshiftAssetsS3Bucket,
          target_handle: 'bottom',
          source_handle: 'top',
        },
        {
          access_level: AccessLevel.ReadWrite,
          target_node: ResourceNodeID.AnalyticsDataDynamoTable,
          target_handle: 'bottom',
          source_handle: 'top',
        },
      ],
      hint_messages: [
        {
          title: 'Level Objective',
          content: OBJECTIVE2_HINT_MSG1,
        },
        {
          title: 'Hint #1',
          content: OBJECTIVE2_HINT_MSG2,
        },
        {
          title: 'Hint #2',
          content: OBJECTIVE2_HINT_MSG3,
        },
      ],
      finished: false,
    },
    {
      id: PolicyNodeID.InternPolicy,
      validate_fn_name: PolicyNodeID.InternPolicy,
      type: ObjectiveType.POLICY_EDIT_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyEditFinishEvent.INTERN_POLICY_EDITED,
      callout_message: OBJECTIVE_CALLOUT_MSG2,
      resources_to_grant: [
        {
          access_level: AccessLevel.Read,
          target_node: ResourceNodeID.TimeshiftAssetsS3Bucket,
          target_handle: 'bottom',
          source_handle: 'top',
        },
      ],
      hint_messages: [
        {
          title: 'Level Objective',
          content: OBJECTIVE3_HINT_MSG1,
        },
        {
          title: 'Hint #1',
          content: OBJECTIVE3_HINT_MSG2,
        },
      ],
      finished: false,
    },
  ],
];
