import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import s3ReadPolicySchema from '../schemas/policy/s3-read-policy-schema.json';
import s3ReadWriteIdentityPolicySchema from '../schemas/policy/\
s3-read-write-identity-policy-schema.json';
import s3ReadWriteResourcePolicySchema from '../schemas/policy/\
s3-read-write-resource-policy-schema.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { createEdge } from '@/factories/edge-factory';
import { createPolicyCreationObjective } from '@/factories/objectives-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { AccountID, IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel, IAMNodeEntity } from '@/types';
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

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.TutorialResourceBasedPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadPolicySchema,
      on_finish_event: PolicyCreationFinishEvent.TUTORIAL_RESOURCE_BASED_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(s3ReadPolicySchema),
      initial_code: INITIAL_POLICIES.S3_READ_RESOURCE_BASED_POLICY,
      limit_new_lines: false,
      created_node_initial_position: 'bottom-center',
      callout_message: OBJECTIVE1_CALLOUT_MSG,
      initial_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.TutorialResourceBasedPolicy,
            target: ResourceNodeID.TutorialS3Bucket,
          },
          dataOverrides: {
            hovering_label: 'Attached To',
          },
        }),
        createEdge({
          rootOverrides: {
            source: UserNodeID.TutorialFirstUser,
            target: ResourceNodeID.TutorialS3Bucket,
          },
          dataOverrides: {
            hovering_label: 'Read Access through Bucket Policy',
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
    } as Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.InsideLevelResourceBasedPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadWriteResourcePolicySchema,
      on_finish_event: PolicyCreationFinishEvent.IN_LEVEL_RESOURCE_BASED_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(s3ReadWriteResourcePolicySchema),
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      limit_new_lines: false,
      created_node_initial_position: 'bottom-left',
      account_id: AccountID.Trusting,
      initial_edges: [
        createEdge({
          rootOverrides: {
            source: PolicyNodeID.InsideLevelResourceBasedPolicy,
            target: ResourceNodeID.InsideLevelS3Bucket,
          },
          dataOverrides: {
            hovering_label: 'Attached To',
          },
        }),
      ],
    } as Partial<IAMPolicyCreationObjective<FinishEventMap>>,
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.InsideLevelIdentityBasedPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadWriteIdentityPolicySchema,
      on_finish_event: PolicyCreationFinishEvent.IN_LEVEL_IDENTITY_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(s3ReadWriteIdentityPolicySchema),
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      account_id: AccountID.Trusted,
      limit_new_lines: false,
      created_node_initial_position: 'bottom-right',
      granted_accesses: [
        {
          target_node: ResourceNodeID.InsideLevelS3Bucket,
          access_level: AccessLevel.ReadWrite,
          target_handle: 'right',
          source_handle: 'left',
        },
      ],
    } as Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
