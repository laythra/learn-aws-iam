import { ValidateFunctionsFnName } from '../level-runtime-fns';
import { FinishEventMap, PolicyEditFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { AccessLevel, IAMNodeEntity } from '@/types/iam-enums';
import { IAMPolicyEditObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE_CALLOUT_MSG = `
  IAM covers hundreds of actions across AWS services.
  We'll focus on the most commonly used ones here.
  To explore the full list, check [here](https://gist.github.com/itshella-dom/b7b6fe90796570b4481cab34ef502531).
`;

const OBJECTIVE1_HINT_MSG1 = `
  Developers should:
  - Have *read/write* access to the \`customer-data\` **DynamoDB Table**.
  - Have *read/write* access to the \`timeshift-assets\` **S3 Bucket** objects.

  The actions needed for *read/write* access to a DynamoDB table are:
  - \`dynamodb:GetItem\`
  - \`dynamodb:PutItem\`
  - \`dynamodb:UpdateItem\`
  - \`dynamodb:Scan\`
  - \`dynamodb:Query\`
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

const OBJECTIVE2_HINT_MSG1 = `
  Data Scientists should:
  - Have *read/write* access to the \`AnalyticsData\` **DynamoDB Table**.
  - Have *read/write* access to the \`timeshift-assets\` **S3 Bucket** objects.
`;

const OBJECTIVE2_HINT_MSG2 = `
  The resource is using a wildcard (\`*\`), making the policy far too permissive.
`;

const OBJECTIVE2_HINT_MSG3 = `
  A statement is missing from this policy.
  It should grant read/write access to the \`timeshift-assets\` **S3 Bucket** objects.
`;

const OBJECTIVE3_HINT_MSG1 = `
  Interns should:
  - Be able to read objects from the \`timeshift-assets\` **S3 Bucket**.
  - Be able to list the contents of the \`timeshift-assets\` **S3 Bucket**.

  Each of these requires its own statement, since they target different resources.

  > |color(warning)
  > Casey and Jordan report they can't access anything at all —
  > even though the policy appears to grant read access.
`;

const OBJECTIVE3_HINT_MSG2 = `
  This policy uses a **Deny** statement targeting \`arn:aws:s3:::timeshift-*\`.

  A developer added it to block intern access to the sensitive \`timeshift-backups\` bucket.
  The intention was correct — but the wildcard \`timeshift-*\` also matches \`timeshift-assets\`,
  overriding the Allow statement below it.

  In IAM, an explicit **Deny always wins** over an Allow.
  The fix is to remove this statement entirely — the \`timeshift-backups\` bucket
  is already protected because interns were never granted access to it in the first place.
`;

const OBJECTIVE3_HINT_MSG3 = `
  \`s3:GetObject\` lets a user read an object if they know its exact key,
  but it does not let them list what's in the bucket.
  \`s3:ListBucket\` is a separate, bucket-level action — and it requires
  a different resource than \`s3:GetObject\`:
  - \`s3:GetObject\` → \`arn:aws:s3:::timeshift-assets/*\`
  - \`s3:ListBucket\` → ???
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
      on_finish_event: PolicyEditFinishEvent.DEVELOPER_POLICY_EDITED,
      resources_to_grant: [
        {
          access_level: AccessLevel.ReadWrite,
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
      callout_message: OBJECTIVE_CALLOUT_MSG,
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
      ],
      finished: false,
    },
    {
      id: PolicyNodeID.DataScientistPolicy,
      validate_fn_name: PolicyNodeID.DataScientistPolicy,
      type: ObjectiveType.POLICY_EDIT_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyEditFinishEvent.DATA_SCIENTIST_POLICY_EDITED,
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
      callout_message: OBJECTIVE_CALLOUT_MSG,
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
      resources_to_grant: [
        {
          access_level: AccessLevel.Read,
          target_node: ResourceNodeID.TimeshiftAssetsS3Bucket,
          target_handle: 'bottom',
          source_handle: 'top',
        },
      ],
      callout_message: OBJECTIVE_CALLOUT_MSG,
      hint_messages: [
        {
          title: 'Level Objective',
          content: OBJECTIVE3_HINT_MSG1,
        },
        {
          title: 'Hint #1',
          content: OBJECTIVE3_HINT_MSG2,
        },
        {
          title: 'Hint #2',
          content: OBJECTIVE3_HINT_MSG3,
        },
      ],
      finished: false,
    },
  ],
];
