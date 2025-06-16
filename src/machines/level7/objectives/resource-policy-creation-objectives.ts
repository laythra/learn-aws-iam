import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import s3ReadPolicySchema from '../schemas/policy/s3-read-policy-schema.json';
import s3ReadWriteResourcePolicySchema from '../schemas/policy/\
s3-read-write-resource-policy-schema.json';
import { FinishEventMap, ResourcePolicyCreationFinishEvent } from '../types/finish-event-enums';
import { ResourceNodeID, ResourcePolicyNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { createResourcePolicyCreationObjective } from '@/factories/objectives-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { AccountID, IAMResourcePolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

const OBJECTIVE1_CALLOUT_MSG = `
  The \`Principal\` takes the same format just like when creating a **Trust Policy**,

  ie: \`{ "AWS": "<user_arn>" }\` for an **IAM User** Principal

  \`{ "Service": "<service-name>.amazonaws.com" }\` for an **AWS Service** Principal.
`;

const OBJECTIVE1_HINT_MSG1 = `
  Recall that we need to give the objects inside the resource access to the Principal
`;

const OBJECTIVE1_HINT_MSG2 = `
  We will to use the format: \`arn:aws:s3:::your_bucket_name/*\`
  to give access to all objects inside the bucket
`;

// eslint-disable-next-line max-len
export const RESOURCE_POLICY_CREATION_OBJECTIVES: IAMResourcePolicyCreationObjective<FinishEventMap>[][] =
  [
    [
      {
        type: ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE,
        entity_id: ResourcePolicyNodeID.TutorialResourceBasedPolicy,
        entity: IAMNodeEntity.ResourcePolicy,
        json_schema: s3ReadPolicySchema,
        on_finish_event: ResourcePolicyCreationFinishEvent.TUTORIAL_RESOURCE_BASED_POLICY_CREATED,
        validate_inside_code_editor: true,
        validate_function: AJV_COMPILER.compile(s3ReadPolicySchema),
        initial_code: INITIAL_POLICIES.S3_READ_RESOURCE_BASED_POLICY,
        limit_new_lines: false,
        layout_group_id: CommonLayoutGroupID.BottomCenterHorizontal,
        resource_node_id: ResourceNodeID.TutorialS3Bucket,
        callout_message: OBJECTIVE1_CALLOUT_MSG,
        initial_edges: [
          createEdge({
            rootOverrides: {
              source: UserNodeID.TutorialFirstUser,
              target: ResourceNodeID.TutorialS3Bucket,
            },
            dataOverrides: {
              hovering_label: 'Has access through the resource policy',
            },
          }),
        ],
        help_badges: [
          {
            path: 'Statement[0].Resource',
            content: 'The resource the policy is applied to',
            color: 'yellow',
          },
          {
            path: 'Statement[0].Principal',
            content: 'The Principal which is allowed/denied access to the resource',
            color: 'yellow',
          },
        ],
        hint_messages: [
          {
            title: 'Hint #1',
            content: OBJECTIVE1_HINT_MSG1,
          },
          {
            title: 'Hint #2',
            content: OBJECTIVE1_HINT_MSG2,
          },
        ],
      } satisfies Partial<IAMResourcePolicyCreationObjective<FinishEventMap>>,
    ].map(objective => createResourcePolicyCreationObjective(objective)),
    [
      {
        type: ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE,
        entity_id: ResourcePolicyNodeID.InsideLevelResourceBasedPolicy,
        entity: IAMNodeEntity.ResourcePolicy,
        json_schema: s3ReadWriteResourcePolicySchema,
        on_finish_event: ResourcePolicyCreationFinishEvent.IN_LEVEL_RESOURCE_BASED_POLICY_CREATED,
        validate_inside_code_editor: true,
        validate_function: AJV_COMPILER.compile(s3ReadWriteResourcePolicySchema),
        initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
        limit_new_lines: false,
        layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
        account_id: AccountID.Trusting,
        resource_node_id: ResourceNodeID.InsideLevelS3Bucket,
      } satisfies Partial<IAMResourcePolicyCreationObjective<FinishEventMap>>,
    ].map(objective => createResourcePolicyCreationObjective(objective)),
  ];
