import { INITIAL_POLICIES } from '../initial-policies';
import { ObjectivesApplicableNodesFnName } from '../level-runtime-fns';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { createPolicyCreationObjective } from '@/levels/utils/factories/identity-policy-creation-objective-factory';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMIdentityPolicyCreationObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE1_DESCRIPTION = `
  This policy needs three statements — the third one is already filled in for you.

  **Statement 1 — Tag Creation**
  Allows adding tags to a resource, but only during a \`RunInstances\` call.
  This is necessary because EC2 applies tags via a separate \`CreateTags\` call at launch time.

  **Statement 2 — Instance Launch**
  Allows launching EC2 instances only when the request carries the correct tags:
  The tags are:

  * **\`application\`**: must match the caller's application tag
  * **\`environment\`**: must be one of \`dev\`, \`staging\`, or \`prod\`
  * **\`Name\`**: optional; any descriptive label for the instance

  **Statement 3 — Supporting Resources** *(pre-filled)* Leave this one as-is.
`;

const OBJECTIVE2_DESCRIPTION = `
  Allow teams to start and stop their own EC2 instances.

  Each instance is tagged with the application (team) that owns it — use that to scope access.
`;

const OBJECTIVE1_HINT_MSG1 = `
  Three condition key types are relevant:

  - **\`aws:PrincipalTag/<key>\`** — tag on the calling user
  - **\`aws:RequestTag/<key>\`** — tag value included in the request
  - **\`aws:TagKeys\`** — the set of tag key names in the request
`;

const OBJECTIVE1_HINT_MSG2 = `
  \`ec2:CreateTags\` fires as a side-effect of \`RunInstances\`,
  but it can also be called standalone — which you don't want to allow.

  Use \`ec2:CreateAction\` to restrict it to only fire when triggered by a specific parent action.
`;

const OBJECTIVE1_HINT_MSG3 = `
  Statement 2 needs three conditions:

  1. \`aws:RequestTag/application\` must equal the caller's own application tag
  - use a policy variable.

  2. \`aws:RequestTag/environment\` must be one of \`dev\`, \`staging\`, or \`prod\`.

  3. \`aws:TagKeys\` must not contain any keys outside the allowed set.
     Which condition operator enforces that?
`;

const OBJECTIVE1_HINT_MSG4 = `
  **Statement 1** — \`ec2:CreateTags\` with \`ec2:CreateAction: "RunInstances"\`

  **Statement 2** — \`ec2:RunInstances\` on \`arn:aws:ec2:*:*:instance/*\` with:
  - \`StringEquals\` for \`aws:RequestTag/application\` and \`aws:RequestTag/environment\`
  - \`ForAllValues:StringEquals\` for \`aws:TagKeys\`

  **Statement 3** — already there. \`ec2:RunInstances\` on the supporting resources
  (subnet, network-interface, security-group, volume, image) — no conditions needed.
`;

const OBJECTIVE2_HINT_MSG1 = `
  Each EC2 instance is tagged with the \`application\` that owns it.

  Two condition keys are relevant:

  - **\`aws:PrincipalTag/application\`** — the \`application\` tag on the calling user
  - **\`aws:ResourceTag/application\`** — the \`application\` tag on the resource
`;

const OBJECTIVE2_HINT_MSG2 = `
  Match the resource's \`application\` tag against the caller's using a policy variable:

  ~~~js
  "StringEquals": {
    "aws:ResourceTag/application": "???" ::badge[CALLER'S APPLICATION TAG]::
  }|fullwidth
  ~~~
`;

const OBJECTIVE2_HINT_MSG3 = `
  The two actions for managing EC2 instance state are:
  - \`ec2:StopInstances\`
  - \`ec2:StartInstances\`
`;

const OBJECTIVE1_CALLOUT_MSG = `
  The third statement is pre-filled and covers the supporting
  resources EC2 needs when launching an instance, like ***subnets***,
  ***network interfaces***, ***security groups***, ***volumes***, and ***AMIs***.

  These don't carry the same tag enforcement as the instance itself;
  they just need to be reachable. No need to tinker with this statement.
`;

const OBJECTIVE1_HELP_BADGES = [
  {
    path: '/Statement/0/Action',
    content: 'Which EC2 action allows tagging a resource?',
    color: 'yellow',
  },
  {
    path: '/Statement/0/Condition',
    content: 'This action should only be allowed during a specific other action',
    color: 'yellow',
  },
  {
    path: '/Statement/1/Action',
    content: 'Which EC2 action launches a new instance?',
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
      on_finish_event: PolicyCreationFinishEvent.ALLOW_CREATE_EC2_WITH_TAGS_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.POLICY_WITH_CONDITION,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      callout_message: OBJECTIVE1_CALLOUT_MSG,
      hint_messages: [
        {
          title: 'Objective',
          content: OBJECTIVE1_DESCRIPTION,
        },
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
          title: 'Show Me the Keys',
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
      id: PolicyNodeID.EC2ManagePolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.IdentityPolicy,
      on_finish_event: PolicyCreationFinishEvent.MANAGE_EC2_POLICY_CREATED,
      initial_code: INITIAL_POLICIES.EC2_MANAGEMENT_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomLeftHorizontal,
      extra_data: {
        granted_accesses: [
          {
            access_level: AccessLevel.StartStopControl,
            target_handle: 'left',
            source_handle: 'right',
            target_node: ResourceNodeID.EC2Instance1,
            applicable_nodes_fn_name: 'paymentsTeamApplicableNodes',
          },
          {
            access_level: AccessLevel.StartStopControl,
            target_handle: 'left',
            source_handle: 'right',
            target_node: ResourceNodeID.EC2Instance2,
            applicable_nodes_fn_name: 'complianceTeamApplicableNodes',
          },
          {
            access_level: AccessLevel.StartStopControl,
            target_handle: 'left',
            source_handle: 'right',
            target_node: ResourceNodeID.EC2Instance3,
            applicable_nodes_fn_name: 'analyticsTeamApplicableNodes',
          },
        ],
      },
      help_badges: OBJECTIVE2_HELP_BADGES,
      hint_messages: [
        {
          title: 'Objective',
          content: OBJECTIVE2_DESCRIPTION,
        },
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
