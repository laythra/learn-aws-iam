import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import rdsSharedManagePolicySchema from '../schemas/policy/rds-shared-manage-policy.json';
import rds1ManagePolicySchema from '../schemas/policy/rds1-manage-policy.json';
import rds2managePolicySchema from '../schemas/policy/rds2-manage-policy.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/objectives-factory';
import { IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { IAMNodeFilter } from '@/machines/utils/iam-node-filter';
import { AccessLevel, CommonLayoutGroupID, IAMAnyNode, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

const OBJECTIVE_CALLOUT_MSG = `
  We ultimately want to create two policies that allow connecting to the RDS instances
  and managing them, but only if the user the same tag as the RDS instance.

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  Consult the hints below if you need further help
`;

const SHARED_HINT_MSG1 = `
  Remember the condition operators we discussed earlier?

  For this objective, we want to perform a strict string match,
  what do you think is the best suited operator?
`;

const SHARED_HINT_MSG2 = `
  The condition key we need to define should represent the
  resource tag that is associated with the RDS instance, and the value should be
  the tag value that matches the user tag.

  The most commonly used condition keys for this purpose are:

  - **\`aws:ResourceTag/<tag-key>\`**: checks if the resource has a specific tag key and value.
  - **\`aws:RequestTag/<tag-key>\`**: checks if the request has a specific tag key and value.
`;

const SHARED_HINT_MSG3 = `
  The missing action in the policy would allow listing all RDS instances.
  You can use the \`rds:DescribeDBInstances\` action for this purpose.
`;

const SECOND_OBJECTIVE_HINT_MSG1 = `
  We need to inject ***Policy Variables*** into the policy to make it work for both groups.
  what policy variable do you think we should use to represent the tag value?

  -  \`"\${aws:PrincipalTag/application}"\`: Represents the tag value of the user making the request.
  - \`"\${aws:ResourceTag/application}"\`: Represents the tag value of the resource being accessed.
  - \`"\${aws:RequestTag/application}"\`: Represents the tag value of the request being made.
`;

const SHARED_HINT_MESSAGES = [
  {
    title: 'Condition Operator',
    content: SHARED_HINT_MSG1,
  },
  {
    title: 'Condition Key',
    content: SHARED_HINT_MSG2,
  },
  {
    title: 'Action to List RDS Instances',
    content: SHARED_HINT_MSG3,
  },
];

const SHARED_HELP_BADGES = [
  {
    path: 'Statement[0].Action',
    content: 'Place an action here that helps listing all RDS instances',
    color: 'yellow',
  },
];

const SECOND_OBJECTIVE_HINT_MESSAGES = [
  {
    title: 'Policy Variable for Tag Value',
    content: SECOND_OBJECTIVE_HINT_MSG1,
  },
];

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.RDSManagePolicy1,
      entity: IAMNodeEntity.Policy,
      json_schema: rds1ManagePolicySchema,
      on_finish_event: PolicyCreationFinishEvent.RDS1_MANAGE_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(rds1ManagePolicySchema),
      initial_code: INITIAL_POLICIES.SEPARATE_RDS_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      granted_accesses: [
        {
          target_node: ResourceNodeID.RDS1,
          access_level: AccessLevel.Read,
          source_handle: 'right',
          target_handle: 'bottom',
          applicable_nodes: (nodes: IAMAnyNode[]) =>
            IAMNodeFilter.create()
              .fromNodes(nodes)
              .whereEntityIs(IAMNodeEntity.User)
              .whereHasTag('application', 'peach-team')
              .build(),
        },
      ],
      callout_message: OBJECTIVE_CALLOUT_MSG,
      hint_messages: SHARED_HINT_MESSAGES,
      help_badges: SHARED_HELP_BADGES,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.RDSManagePolicy2,
      entity: IAMNodeEntity.Policy,
      json_schema: rds2managePolicySchema,
      on_finish_event: PolicyCreationFinishEvent.RDS2_MANAGE_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(rds2managePolicySchema),
      initial_code: INITIAL_POLICIES.SEPARATE_RDS_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      granted_accesses: [
        {
          target_node: ResourceNodeID.RDS2,
          access_level: AccessLevel.Read,
          source_handle: 'left',
          target_handle: 'bottom',
          applicable_nodes: (nodes: IAMAnyNode[]) =>
            IAMNodeFilter.create()
              .fromNodes(nodes)
              .whereEntityIs(IAMNodeEntity.User)
              .whereHasTag('application', 'bowser-force')
              .build(),
        },
      ],
      hint_messages: SHARED_HINT_MESSAGES,
      help_badges: SHARED_HELP_BADGES,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.RDSSharedPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: rdsSharedManagePolicySchema,
      on_finish_event: PolicyCreationFinishEvent.RDS_SHARED_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(rdsSharedManagePolicySchema),
      initial_code: INITIAL_POLICIES.SHARED_RDS_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      granted_accesses: [
        {
          target_node: ResourceNodeID.RDS1,
          access_level: AccessLevel.Read,
          source_handle: 'right',
          target_handle: 'bottom',
          applicable_nodes: (nodes: IAMAnyNode[]) =>
            IAMNodeFilter.create()
              .fromNodes(nodes)
              .whereEntityIs(IAMNodeEntity.User)
              .whereHasTag('application', 'peach-team')
              .build(),
        },
        {
          target_node: ResourceNodeID.RDS2,
          access_level: AccessLevel.Read,
          source_handle: 'left',
          target_handle: 'bottom',
          applicable_nodes: (nodes: IAMAnyNode[]) =>
            IAMNodeFilter.create()
              .fromNodes(nodes)
              .whereEntityIs(IAMNodeEntity.User)
              .whereHasTag('application', 'bowser-force')
              .build(),
        },
      ],
      hint_messages: SECOND_OBJECTIVE_HINT_MESSAGES,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
