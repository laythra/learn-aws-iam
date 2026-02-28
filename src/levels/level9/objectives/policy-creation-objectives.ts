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

const OBJECTIVE1_CALLOUT_MSG = `
  Create a policy for **Peach Team** that lets its users:
  - retrieve their team database secret
  - connect to their team RDS database
`;

const OBJECTIVE2_CALLOUT_MSG = `
  Now do the same for **Bowser Force**:
  allow secret retrieval and RDS connection for their team only.
`;

const OBJECTIVE3_CALLOUT_MSG = `
  Notice the wildcards in the resource ARNs.

  They make the shared policy flexible enough
  to cover multiple teams' secrets and databases.

  Instead of creating one policy per team,
  use policy variables with conditions so one policy can scale safely.
`;

const SHARED_HINT_MSG1 = `
  Here's a little refresher of the condition syntax we've covered in previous levels:

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~
`;

const SHARED_HINT_MSG2 = `
  Remember the condition operators we discussed earlier?

  For this objective, we need a strict string match.
  Which operator is best suited for this?
`;

const SHARED_HINT_MSG3 = `
  The most commonly used condition keys for this purpose are:

  - **\`"\aws:PrincipalTag/application"\`**:
    Represents the tag value of the user making the request.
  - **\`"\aws:ResourceTag/application"\`**:
    Represents the tag value of the resource being accessed.
  - **\`"\aws:RequestTag/application"\`**:
    Represents the tag value of the request being made.

  In this scenario, since we want to restrict access based on the resource's team tag,
  which condition key should we use?
`;

const SHARED_HINT_MSG4 = `
  The missing action in the first statement should allow
  users to retrieve
  the database credentials from Secrets Manager.

  You can use the \`secretsmanager:GetSecretValue\` action for this purpose.
`;

const SECOND_OBJECTIVE_HINT_MSG1 = `
  To make one policy work for both groups, use a **policy variable**
  for the condition value.
  Which variable represents the calling user's application tag?

  - **\`"\${aws:PrincipalTag/application}"\`**:
  Represents the tag value of the user making the request.
  - **\`"\${aws:ResourceTag/application}"\`**:
    Represents the tag value of the resource being accessed.
  - **\`"\${aws:RequestTag/application}"\`**:
    Represents the tag value of the request being made.


   > ::badge[TIP]:: Policy variables are condition key values embedded directly
    into a policy using "**$\{\}**" syntax, rather than being evaluated in a condition block.
`;

const HELP_BADGES1 = [
  {
    path: '/Statement/0/Action',
    content: 'Add the action used to retrieve the database secret',
    color: 'yellow',
  },
  {
    path: '/Statement/0/Condition',
    content: 'Fill in correct condition',
    color: 'yellow',
  },
  {
    path: '/Statement/1/Condition',
    content: 'Fill in correct condition',
    color: 'yellow',
  },
];

const HELP_BADGES2 = [
  {
    path: '/Statement/0/Condition',
    content: 'Fill the condition to restrict access based on the application tag',
    color: 'yellow',
  },
  {
    path: '/Statement/1/Condition',
    content: 'Fill the condition to restrict access based on the application tag',
    color: 'yellow',
  },
];

const SHARED_HINT_MESSAGES = [
  {
    title: 'Condition Syntax Refresher',
    content: SHARED_HINT_MSG1,
  },
  {
    title: 'Condition Operator',
    content: SHARED_HINT_MSG2,
  },
  {
    title: 'Condition Key',
    content: SHARED_HINT_MSG3,
  },
  {
    title: 'Action for Secret Retrieval',
    content: SHARED_HINT_MSG4,
  },
];

const SECOND_OBJECTIVE_HINT_MESSAGES = [
  {
    title: 'Condition Key',
    content: SHARED_HINT_MSG3,
  },
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
      initial_code: INITIAL_POLICIES.PEACH_TEAM_RDS_POLICY,
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
            target_node: ResourceNodeID.TeamPeachSecret,
            access_level: AccessLevel.Read,
            source_handle: 'right',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'peachTeamApplicableNodes',
          },
        ],
      },
      callout_message: OBJECTIVE1_CALLOUT_MSG,
      hint_messages: SHARED_HINT_MESSAGES,
      help_badges: HELP_BADGES1,
    } satisfies Partial<
      IAMPermissionPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
    {
      id: PolicyNodeID.RDSManagePolicy2,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.RDS2_MANAGE_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.BOWSER_FORCE_RDS_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      callout_message: OBJECTIVE2_CALLOUT_MSG,
      extra_data: {
        granted_accesses: [
          {
            target_node: ResourceNodeID.RDS2,
            access_level: AccessLevel.Read,
            source_handle: 'left',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'bowserForceApplicableNodes',
          },
          {
            target_node: ResourceNodeID.TeamBowserSecret,
            access_level: AccessLevel.Read,
            source_handle: 'left',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'bowserForceApplicableNodes',
          },
        ],
      },
      hint_messages: SHARED_HINT_MESSAGES,
      help_badges: HELP_BADGES1,
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
      callout_message: OBJECTIVE3_CALLOUT_MSG,
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
            target_node: ResourceNodeID.TeamPeachSecret,
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
          {
            target_node: ResourceNodeID.TeamBowserSecret,
            access_level: AccessLevel.Read,
            source_handle: 'left',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'bowserForceApplicableNodes',
          },
        ],
      },
      hint_messages: SECOND_OBJECTIVE_HINT_MESSAGES,
      help_badges: HELP_BADGES2,
    } satisfies Partial<
      IAMPermissionPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
];
