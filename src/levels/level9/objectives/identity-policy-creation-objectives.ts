import { ObjectivesApplicableNodesFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { createPolicyCreationObjective } from '@/levels/utils/factories/identity-policy-creation-objective-factory';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMIdentityPolicyCreationObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE1_DESCRIPTION = `
  Create a policy for **Alpha Team** that lets its users:
  - retrieve their team database secret
  - connect to their team RDS database
`;

const OBJECTIVE2_DESCRIPTION = `
  Now do the same for **Beta Team**:
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

const STAGE1_HINT_CONDITION_KEY = `
  The most commonly used condition keys for this purpose are:

  - **\`"aws:PrincipalTag/application"\`**:
    Represents the tag value of the user making the request.
  - **\`"aws:ResourceTag/application"\`**:
    Represents the tag value of the resource being accessed.
  - **\`"aws:RequestTag/application"\`**:
    Represents a tag included in a resource-creation or tagging request.

  In this scenario, we want to restrict access based on the **calling user's** team tag.
  Which condition key represents that?
`;

const STAGE2_HINT_CONDITION_KEY = `
  The most commonly used condition keys for this purpose are:

  - **\`"aws:PrincipalTag/application"\`**:
    Represents the tag value of the user making the request.
  - **\`"aws:ResourceTag/application"\`**:
    Represents the tag value of the resource being accessed.
  - **\`"aws:RequestTag/application"\`**:
    Represents a tag included in a resource-creation or tagging request.

  In this scenario, we want to match the **resource's** application tag against the user's tag.
  Which condition key represents the resource's tag?
`;

const SHARED_HINT_MSG4 = `
  The first statement needs two actions for working with secrets in Secrets Manager.

  The primary one is \`secretsmanager:GetSecretValue\`, which lets users retrieve the secret value.

  And we also need an action to **describe** the secret's metadata.
  What do you think that action might be called?
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
    Represents a tag included in a resource-creation or tagging request.

  ***And in case you haven't noticed, Policy variables use the same keys as conditions, but wrapped
  in \`"$\{\}"\` so AWS resolves them to actual values at request time.***
`;

const HELP_BADGES1 = [
  {
    path: '/Statement/0/Action',
    content: 'Add the two actions needed to retrieve and describe the database secret',
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
    content: STAGE1_HINT_CONDITION_KEY,
  },
  {
    title: 'Action for Secret Retrieval',
    content: SHARED_HINT_MSG4,
  },
];

const SECOND_OBJECTIVE_HINT_MESSAGES = [
  {
    title: 'Condition Key',
    content: STAGE2_HINT_CONDITION_KEY,
  },
  {
    title: 'Policy Variable for Tag Value',
    content: SECOND_OBJECTIVE_HINT_MSG1,
  },
];

export const POLICY_CREATION_OBJECTIVES: IAMIdentityPolicyCreationObjective<
  FinishEventMap,
  ObjectivesApplicableNodesFnName
>[][] = [
  [
    {
      id: PolicyNodeID.RDSManagePolicy1,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyCreationFinishEvent.RDS1_MANAGE_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.ALPHA_TEAM_RDS_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      extra_data: {
        granted_accesses: [
          {
            target_node: ResourceNodeID.RDS1,
            access_level: AccessLevel.Read,
            source_handle: 'right',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'alphaTeamApplicableNodes',
          },
          {
            target_node: ResourceNodeID.TeamAlphaSecret,
            access_level: AccessLevel.Read,
            source_handle: 'right',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'alphaTeamApplicableNodes',
          },
        ],
      },
      hint_messages: [
        { title: 'Objective', content: OBJECTIVE1_DESCRIPTION },
        ...SHARED_HINT_MESSAGES,
      ],
      help_badges: HELP_BADGES1,
    } satisfies Partial<
      IAMIdentityPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
    {
      id: PolicyNodeID.RDSManagePolicy2,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyCreationFinishEvent.RDS2_MANAGE_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.BETA_TEAM_RDS_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      extra_data: {
        granted_accesses: [
          {
            target_node: ResourceNodeID.RDS2,
            access_level: AccessLevel.Read,
            source_handle: 'left',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'betaTeamApplicableNodes',
          },
          {
            target_node: ResourceNodeID.TeamBetaSecret,
            access_level: AccessLevel.Read,
            source_handle: 'left',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'betaTeamApplicableNodes',
          },
        ],
      },
      hint_messages: [
        { title: 'Objective', content: OBJECTIVE2_DESCRIPTION },
        ...SHARED_HINT_MESSAGES,
      ],
      help_badges: HELP_BADGES1,
    } satisfies Partial<
      IAMIdentityPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      id: PolicyNodeID.RDSSharedPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
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
            applicable_nodes_fn_name: 'alphaTeamApplicableNodes',
          },
          {
            target_node: ResourceNodeID.TeamAlphaSecret,
            access_level: AccessLevel.Read,
            source_handle: 'right',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'alphaTeamApplicableNodes',
          },
          {
            target_node: ResourceNodeID.RDS2,
            access_level: AccessLevel.Read,
            source_handle: 'left',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'betaTeamApplicableNodes',
          },
          {
            target_node: ResourceNodeID.TeamBetaSecret,
            access_level: AccessLevel.Read,
            source_handle: 'left',
            target_handle: 'bottom',
            applicable_nodes_fn_name: 'betaTeamApplicableNodes',
          },
        ],
      },
      hint_messages: [
        ...SECOND_OBJECTIVE_HINT_MESSAGES,
        { title: 'Context', content: OBJECTIVE3_CALLOUT_MSG },
      ],
      help_badges: HELP_BADGES2,
    } satisfies Partial<
      IAMIdentityPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
];
