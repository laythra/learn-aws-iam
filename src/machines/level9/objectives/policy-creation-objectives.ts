import { ObjectivesApplicableNodesFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types/objective-types';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';

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

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<
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
      IAMPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
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
      IAMPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
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
      IAMPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
];
