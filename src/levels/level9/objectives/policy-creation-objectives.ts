import { ObjectivesApplicableNodesFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import {
  IAMPermissionPolicyCreationObjective,
  ObjectiveType,
} from '@/levels/types/objective-types';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';

const OBJECTIVE_CALLOUT_MSG = `
  First, create two policies that allow access to RDS instances,
  but only when the user's application tag matches the resource's application tag.

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  Use the hints below if needed.
`;

const SHARED_HINT_MSG1 = `
  Remember the condition operators we discussed earlier?

  For this objective, we need a strict string match.
  Which operator is best suited for that?
`;

const SHARED_HINT_MSG2 = `
  The condition key should represent the RDS resource tag,
  and the value should match the user's application tag.

  The most commonly used condition keys for this purpose are:

  - **\`aws:ResourceTag/<tag-key>\`**: checks if the resource has a specific tag key and value.
  - **\`aws:RequestTag/<tag-key>\`**: checks if the request has a specific tag key and value.
`;

const SHARED_HINT_MSG3 = `
  The missing action in the first statement should allow listing RDS instances.
  You can use the \`rds:DescribeDBInstances\` action for this purpose.
`;

const SECOND_OBJECTIVE_HINT_MSG1 = `
  To make one policy work for both groups, use a **policy variable**
  for the condition value.
  Which variable should represent the calling user's application tag?

  - \`"\${aws:PrincipalTag/application}"\`: Represents the tag value of the user making the request.
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
    path: '/Statement/0/Action',
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

export const POLICY_CREATION_OBJECTIVES: IAMPermissionPolicyCreationObjective<
  FinishEventMap,
  ObjectivesApplicableNodesFnName
>[][] = [
  [
    {
      id: PolicyNodeID.RDSManagePolicy1,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.RDS1_MANAGE_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.SEPARATE_RDS_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      extra_data: {
        granted_accesses: [
          {
            target_node: ResourceNodeID.RDS1,
            access_level: AccessLevel.Read,
            source_handle: 'right',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'peachTeamApplicableNodes',
          },
        ],
      },
      callout_message: OBJECTIVE_CALLOUT_MSG,
      hint_messages: SHARED_HINT_MESSAGES,
      help_badges: SHARED_HELP_BADGES,
    } satisfies Partial<
      IAMPermissionPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
    {
      id: PolicyNodeID.RDSManagePolicy2,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.RDS2_MANAGE_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.SEPARATE_RDS_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      extra_data: {
        granted_accesses: [
          {
            target_node: ResourceNodeID.RDS2,
            access_level: AccessLevel.Read,
            source_handle: 'left',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'bowserForceApplicableNodes',
          },
        ],
      },
      hint_messages: SHARED_HINT_MESSAGES,
      help_badges: SHARED_HELP_BADGES,
    } satisfies Partial<
      IAMPermissionPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      id: PolicyNodeID.RDSSharedPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.RDS_SHARED_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.SHARED_RDS_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      extra_data: {
        granted_accesses: [
          {
            target_node: ResourceNodeID.RDS1,
            access_level: AccessLevel.Read,
            source_handle: 'right',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'peachTeamApplicableNodes',
          },
          {
            target_node: ResourceNodeID.RDS2,
            access_level: AccessLevel.Read,
            source_handle: 'left',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'bowserForceApplicableNodes',
          },
        ],
      },
      hint_messages: SECOND_OBJECTIVE_HINT_MESSAGES,
    } satisfies Partial<
      IAMPermissionPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
];
