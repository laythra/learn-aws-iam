import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import createRDSWithTagsPolicy from '../schemas/policy/create-rds-with-tags-policy.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/objectives-factory';
import { IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

const OBJECTIVE_CALLOUT_MSG = `
  This objective will require creating a policy with two statements:
  - The first statement allows users to create tags **only** when creating a new RDS instance.
  - The second statement allows users to create RDS instances while
  requiring specific **Request Tags**.

  The hints below should describe the exact requirements for each statement.
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

const FIRST_OBJECTIVE_HELP_BADGES = [
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

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.TBACPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: createRDSWithTagsPolicy,
      on_finish_event: PolicyCreationFinishEvent.ALLOW_CREATE_RDS_WITH_TAGS_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(createRDSWithTagsPolicy),
      initial_code: INITIAL_POLICIES.POLICY_WITH_CONDITION,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.CenterHorizontal,
      granted_accesses: [],
      callout_message: OBJECTIVE_CALLOUT_MSG,
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
      help_badges: FIRST_OBJECTIVE_HELP_BADGES,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
