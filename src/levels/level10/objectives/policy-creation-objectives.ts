import { ObjectivesApplicableNodesFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/levels/consts';
import {
  IAMPermissionPolicyCreationObjective,
  ObjectiveType,
} from '@/levels/types/objective-types';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';

const OBJECTIVE1_CALLOUT_MSG = `
  This objective will require creating a policy with two statements:
  - The first statement allows users to create tags **only** when creating a new RDS instance.
  - The second statement allows users to create RDS instances while
  requiring specific **Request Tags**.

  The hints below should describe the exact requirements for each statement.
`;

const OBJECTIVE2_CALLOUT_MSG = `
  Recall our discussion about resource tags and request tags?

  * **Resources Tags** are tags that are already attached to the resources we wish to control
  access to.|lg

  * **Request Tags** are tags that we can mandate requests with,
  and use to control access to resources based on the tags that are attached to the request.|lg
`;

const CONDITIONS_HINT_MSG = `
  Remember the condition operators we discussed earlier? Here's a quick refresher:

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~
`;

const OBJECTIVE1_HINT_MSG1 = `
  For the first statement:

  * The action should specifically allow tagging RDS instances.
  Can you identify the correct action to use here? (a simple google search might help!)

  * The condition should ensure that this action applies **only** when creating RDS instances.
`;

const OBJECTIVE1_HINT_MSG2 = `
  For the second statement:

  * The action should allow simply creating RDS instances.

  * The condition should mandate the following tags:
    * \`team\` - must match the principal's team name.
    * \`environment\` - must be one of: \`dev\`, \`staging\`, or \`prod\`.
    * \`name\` - can be any descriptive name for the RDS instance.

  Also, the condition should ensure that no extra tags have been passed!
`;

const OBJECTIVE2_HINT_MSG1 = `
  Users should be able to stop / start their own RDS instances,
  but not the RDS instances of other teams.

  How can we know which RDS instances belong to which team?
  By using resource tags, specifically the \`team\` resource tag!
`;

const OBJECTIVE2_HINT_MSG2 = `
  Remember the policy variables we used in the previous level?

  We can use the \`aws:ResourceTag/team\` variable to refer to the \`team\`
  tag of the RDS instance being accessed.
`;

const OBJECTIVE1_HELP_BADGES = [
  {
    path: '/Statement/0/Action',
    content: 'The action which allows tagging RDS instances',
    color: 'yellow',
  },
  {
    path: '/Statement/0/Condition',
    content: 'The action should ONLY apply when creating RDS instances',
    color: 'yellow',
  },
  {
    path: '/Statement/1/Action',
    content: 'The action which allows creating RDS instances',
    color: 'yellow',
  },
  {
    path: '/Statement/1/Condition',
    content: 'The action should be accompanied by some mandatory ***Request Tags***',
    color: 'yellow',
  },
];

const OBJECTIVE2_HELP_BADGES = [
  {
    path: '/Statement',
    content: 'Place your actions and conditions inside the Statement here',
    color: 'yellow',
  },
];

export const POLICY_CREATION_OBJECTIVES: IAMPermissionPolicyCreationObjective<
  FinishEventMap,
  ObjectivesApplicableNodesFnName
>[][] = [
  [
    {
      id: PolicyNodeID.TBACPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.ALLOW_CREATE_RDS_WITH_TAGS_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.POLICY_WITH_CONDITION,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      callout_message: OBJECTIVE1_CALLOUT_MSG,
      hint_messages: [
        {
          title: 'Condition Operators',
          content: CONDITIONS_HINT_MSG,
        },
        {
          title: 'First Statement',
          content: OBJECTIVE1_HINT_MSG1,
        },
        {
          title: 'Second Statement',
          content: OBJECTIVE1_HINT_MSG2,
        },
      ],
      help_badges: OBJECTIVE1_HELP_BADGES,
      extra_data: {
        granted_accesses: [],
      },
    } satisfies Partial<
      IAMPermissionPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      id: PolicyNodeID.RDSManagePolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.MANAGE_RDS_POLICY_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      extra_data: {
        granted_accesses: [
          {
            access_level: AccessLevel.StartStopControl,
            target_handle: 'left',
            source_handle: 'right',
            target_node: ResourceNodeID.RDS1,
            applicable_nodes_fn_name: 'paymentsTeamApplicableNodes',
          },
          {
            access_level: AccessLevel.StartStopControl,
            target_handle: 'left',
            source_handle: 'right',
            target_node: ResourceNodeID.RDS2,
            applicable_nodes_fn_name: 'complianceTeamApplicableNodes',
          },
          {
            access_level: AccessLevel.StartStopControl,
            target_handle: 'left',
            source_handle: 'right',
            target_node: ResourceNodeID.RDS3,
            applicable_nodes_fn_name: 'analyticsTeamApplicableNodes',
          },
        ],
      },
      callout_message: OBJECTIVE2_CALLOUT_MSG,
      help_badges: OBJECTIVE2_HELP_BADGES,
      hint_messages: [
        {
          title: 'Condition Operators',
          content: CONDITIONS_HINT_MSG,
        },
        {
          title: 'Managing RDS Instances',
          content: OBJECTIVE2_HINT_MSG1,
        },
        {
          title: 'Resource Tags',
          content: OBJECTIVE2_HINT_MSG2,
        },
      ],
    } satisfies Partial<
      IAMPermissionPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
];
