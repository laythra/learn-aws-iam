import { ValidateFunctionsFnName } from '../level-runtime-fns';
import { FinishEventMap, PolicyEditFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { IAMPolicyEditObjective, ObjectiveType } from '@/levels/types/objective-types';
import { AccessLevel, IAMNodeEntity } from '@/types/iam-enums';

const OBJECTIVE_CALLOUT_MSG = `
  IAM offers hundreds of actions across AWS services.
  Covering all of them isn’t practical, so we’ll focus on the most important ones.
  If you want to explore the full list, check [here](https://github.com/TryTryAgain/aws-iam-actions-list/blob/master/all-actions.txt)
`;

const OBJECTIVE_CALLOUT_MSG2 = `
  This policy is using the \`Condition\` directive which we haven't covered yet.
  It's used to specify when a policy is in effect.
  In this case, it's denying all types of actions if the user is not using MFA
`;

const OBJECTIVE1_HINT_MSG1 = `
  Developers Should:
  - Have read/write access to the \`customer-data\` **DynamoDB Table**.
  - Have read/write access to the \`timeshift-assets\` **S3 Bucket** Objects.
`;

const OBJECTIVE1_HINT_MSG2 = `
  The first action concerning the **DynamoDB Table** here is way too permissive.
  We just want to grant read/write access to the \`customer-data\` **DynamoDB Table**.
`;

const OBJECTIVE1_HINT_MSG3 = `
  While the second action concerning the *timeshift-assets* **S3 Bucket** may look correct,
  There's a subtle issue with the resource being targeted. it's operating on the bucket itself,
  not the objects within the bucket.
`;

const OBJECTIVE1_HINT_MSG4 = `
  The actions needed for grant *read/write* access to the dynamodb table are:
  - \`dynamodb:GetItem\`
  - \`dynamodb:PutItem\`
  - \`dynamodb:Scan\`
  - \`dynamodb:Query\`
`;

const OBJECTIVE2_HINT_MSG1 = `
  Data Scientists Should:
  - Have read/write access to the \`AnalyticsData\` **DynamoDB Table**.
  - Have read/write access to the \`timeshift-assets\` **S3 Bucket** Objects.
`;

const OBJECTIVE2_HINT_MSG2 = `
  The resource is using the wildcard (\`*\`), causing the action to be way too permissive.
`;

const OBJECTIVE2_HINT_MSG3 = `
  There's a statement item missing in the policy.
  It should be granting read/write access to the \`timeshift-assets\` **S3 Bucket** Objects.
`;

const OBJECTIVE3_HINT_MSG1 = `
  Interns Should:
  - Have *read* access to the \`customer-data\` **DynamoDB Table**.
`;

const OBJECTIVE3_HINT_MSG2 = `
  Clearly, there's something preventing the statement specifying the read access to take effect.
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
      entity: IAMNodeEntity.Policy,
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
      entity: IAMNodeEntity.Policy,
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
      entity: IAMNodeEntity.Policy,
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
