import { ObjectivesApplicableNodesFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { createPolicyCreationObjective } from '@/levels/utils/factories/identity-policy-creation-objective-factory';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMIdentityPolicyCreationObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE1_CALLOUT_MSG = `
  This policy needs two statements working together:

  **Statement 1 — Tag Creation**
  Permits adding tags to RDS resources, but **only** during instance creation.
  Without this, the creation action won't be allowed to attach tags at all.

  **Statement 2 — Instance Creation**
  Permits creating RDS instances, but **only** if the request includes the correct tags.
  This is where Request Tags enforce your tagging rules.

  Use the hints below for guidance on the condition keys and operators needed.
`;

const OBJECTIVE2_CALLOUT_MSG = `
  Teams should only be able to ***Stop*** and ***Start*** their **own** RDS instances.

  Think about what differentiates one team's RDS instance from another's,
  and how you can use that to restrict access.
`;

const OBJECTIVE1_HINT_MSG1 = `
  Recall from the last level that IAM Policies can include specific Condition Keys
  to enforce tag-based rules.

  - **\`aws:PrincipalTag/<key>\`**:
    Represents the tag value of the user making the request.
  - **\`aws:ResourceTag/<key>\`**:
    Represents the tag value of the resource being accessed.
  - **\`aws:RequestTag/<key>\`**:
    Represents a tag value being passed **with** the request itself.
  - **\`aws:TagKeys\`**:
    The set of tag key names being passed with the request - We didn’t cover this one before./

  Which of these condition keys do you see fitting for each statement's requirements?
`;

const OBJECTIVE1_HINT_MSG2 = `
  For Statement 1, the action needs to be restricted so that tagging
  can only happen as part of a specific operation — not standalone.

  Here's a reminder of condition syntax:

  ~~~js
  "Condition": {
    "StringEquals": { ::badge[CONDITION OPERATOR]::
      "<condition-key>": "<condition-value>" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  AWS exposes service-specific condition keys that let you inspect what operation
  triggered a given action. Think about what value the condition should check against —
  what is the "parent" operation that should gate this tagging action?
`;

const OBJECTIVE1_HINT_MSG3 = `
  For Statement 2, three conditions need to be satisfied:

  1. The \`team\` tag on the request must match the caller's own team tag.
     Which condition key from hint 1 represents a tag being passed with a request?
     And which represents the caller's identity tag? Remember policy variables from the last level.

  2. The \`environment\` tag must be one of the allowed values.
     For multiple valid values, what do you think the condition value looks like?

  3. No tag keys beyond the required three should be allowed.
     The \`aws:TagKeys\` condition key holds all tag keys in the request.
     What operator would enforce that every key belongs to a known set?
`;

const OBJECTIVE1_HINT_MSG4 = `
  Still stuck? Here are the specific building blocks — the rest is up to you.

  >|color(blue)
  > IAM condition keys come in two types:
  > - **Global** (\`aws:*\`) — apply across all services,
   e.g. \`aws:RequestTag\`, \`aws:PrincipalTag\`
  > - **Service-specific** (\`rds:*\`, \`s3:*\`, ...)
   — defined by a service for its own concepts

  Among the relevant RDS actions: \`rds:AddTagsToResource\` (Statement 1)
  and \`rds:CreateDBInstance\` (Statement 2).

  For **Statement 1** — there's a service-specific condition key called \`rds:CreateAction\`.
  What value do you think it should be set to?

  For **Statement 2** — to prevent extra tags, the \`ForAllValues:StringEquals\` operator
  checks that every key in the request belongs to a specified set.
  Pair it with \`aws:TagKeys\` and the three tag names you need to enforce.
`;

const OBJECTIVE2_HINT_MSG1 = `
  Each RDS instance is tagged with the \`team\` that owns it.

  Here's a little reminder of common condition key/values for tag-based access control:

  - **\`aws:PrincipalTag/<key>\`**:
    Represents the tag value of the user making the request.
  - **\`aws:ResourceTag/<key>\`**:
    Represents the tag value of the resource being accessed.
  - **\`aws:RequestTag/<key>\`**:
    Represents a tag value being passed **with** the request itself.
`;

const OBJECTIVE2_HINT_MSG2 = `
  Use a policy variable to dynamically match the resource's team against the caller's team.

  ~~~js
  "StringEquals": {
    "???": "???" ::badge[CALLER'S TEAM TAG]::
  }|fullwidth
  ~~~

  > |color(tip)
  > ::badge[TIP]:: Same pattern as the previous level —
  > one policy, any number of teams.
`;

const OBJECTIVE2_HINT_MSG3 = `
  The actions required for starting and stopping RDS instances are
  - \`rds:StopDBInstance\`
  - \`rds:???\`.
`;

const OBJECTIVE1_HELP_BADGES = [
  {
    path: '/Statement/0/Action',
    content: 'Which RDS action allows tagging a resource?',
    color: 'yellow',
  },
  {
    path: '/Statement/0/Condition',
    content: 'This action should only be allowed during a specific other action',
    color: 'yellow',
  },
  {
    path: '/Statement/1/Action',
    content: 'Which RDS action creates a new instance?',
    color: 'yellow',
  },
  {
    path: '/Statement/1/Condition',
    content: 'Enforce the required request tags — and prevent any extras',
    color: 'yellow',
  },
];

const OBJECTIVE2_HELP_BADGES = [
  {
    path: '/Statement',
    content: 'One statement is enough — use a resource tag condition to restrict per-team access',
    color: 'yellow',
  },
];

export const POLICY_CREATION_OBJECTIVES: IAMIdentityPolicyCreationObjective<
  FinishEventMap,
  ObjectivesApplicableNodesFnName
>[][] = [
  [
    {
      id: PolicyNodeID.TBACPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyCreationFinishEvent.ALLOW_CREATE_RDS_WITH_TAGS_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.POLICY_WITH_CONDITION,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      callout_message: OBJECTIVE1_CALLOUT_MSG,
      hint_messages: [
        {
          title: 'Tag Condition Keys',
          content: OBJECTIVE1_HINT_MSG1,
        },
        {
          title: 'Statement 1 — Restricting the Tagging Action',
          content: OBJECTIVE1_HINT_MSG2,
        },
        {
          title: 'Statement 2 — Enforcing Request Tags',
          content: OBJECTIVE1_HINT_MSG3,
        },
        {
          title: 'Last Resort',
          content: OBJECTIVE1_HINT_MSG4,
        },
      ],
      help_badges: OBJECTIVE1_HELP_BADGES,
      extra_data: {
        granted_accesses: [],
      },
    } satisfies Partial<
      IAMIdentityPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
  [
    {
      id: PolicyNodeID.RDSManagePolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyCreationFinishEvent.MANAGE_RDS_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.RDS_MANAGEMENT_POLICY,
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
          title: 'Identifying Team Ownership',
          content: OBJECTIVE2_HINT_MSG1,
        },
        {
          title: 'Matching with a Policy Variable',
          content: OBJECTIVE2_HINT_MSG2,
        },
        {
          title: 'Required Actions',
          content: OBJECTIVE2_HINT_MSG3,
        },
      ],
    } satisfies Partial<
      IAMIdentityPolicyCreationObjective<FinishEventMap, ObjectivesApplicableNodesFnName>
    >,
  ].map(objective => createPolicyCreationObjective(objective)),
];
