import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import tutorialPolicySchema from '../schemas/policy/tutorial-permission-policy-schema.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/objectives-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

const OBJECTIVE1_CALLOUT_MSG = `
  The goal of this objective is to create a permission policy which allows the creator
  of each EC2 instance to terminate it.

  Below is a brief overview of the \`Condition\` element in IAM policies:

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~
`;

const OBJECTIVE1_HINT_MSG1 = `
  For the condition operators, the most commonly used ones are:
  - **\`StringEquals\`**: checks if a string matches a specific value.
  - **\`StringLike\`**: checks if a string matches a pattern (supports wildcards).
  - **\`Bool\`**: evaluates to true or false.
  - **\`NumericEquals\`**: checks if a numeric value matches a specific number.

  In this case, we want to check if the creator of the EC2 instance
  is the same as the principal making the request
`;

const OBJECTIVE1_HINT_MSG2 = `
  As for the condition keys, there are thousands of them available,
  but the most commonly used ones are:
  - **\`<resource-name>:ResourceTag/<tag-key>\`**: checks the tags attached to the resource.
  - **\`<resource-name>:RequestTag/<tag-key>\`**: checks the tags attached to the request.

  In this case, the resource name is \`ec2\`,
  which leaves us with the condition key you're gonna construct
`;

const OBJECTIVE1_HINT_MSG3 = `
  Condition values can be a fixed value, like \`"true"\` or \`"false"\`,
  or they can be a variable, like:
  - \`\${aws:username}\`: the username of the principal making the request.
  - \`\${aws:userid}\`: the unique identifier of the principal making the request.

  In this case, the value should be the username of the principal who created the EC2 instance.
`;

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.TutorialEC2TerminatePolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: MANAGED_POLICIES.EmptyPolicy, // What is this for?
      on_finish_event: PolicyCreationFinishEvent.TUTORIAL_PERMISSION_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(tutorialPolicySchema),
      initial_code: INITIAL_POLICIES.IN_LEVEL_INITIAL_SCP,
      limit_new_lines: false,
      created_node_initial_position: 'bottom-left',
      initial_edges: [],
      granted_accesses: [
        {
          target_node: ResourceNodeID.TutorialEC2Instance1,
          access_level: AccessLevel.Delete,
          target_handle: 'bottom',
          source_handle: 'top',
          source_node: UserNodeID.James,
        },
        {
          target_node: ResourceNodeID.TutorialEC2Instance2,
          access_level: AccessLevel.Delete,
          target_handle: 'bottom',
          source_handle: 'top',
          source_node: UserNodeID.Bond,
        },
        {
          target_node: ResourceNodeID.TutorialEC2Instance3,
          access_level: AccessLevel.Delete,
          target_handle: 'bottom',
          source_handle: 'top',
          source_node: UserNodeID.James,
        },
        {
          target_node: ResourceNodeID.TutorialEC2Instance4,
          access_level: AccessLevel.Delete,
          target_handle: 'bottom',
          source_handle: 'top',
          source_node: UserNodeID.Bond,
        },
      ],
      callout_message: OBJECTIVE1_CALLOUT_MSG,
      hint_messages: [
        {
          title: 'Condition Operators',
          content: OBJECTIVE1_HINT_MSG1,
        },
        {
          title: 'Condition Keys',
          content: OBJECTIVE1_HINT_MSG2,
        },
        {
          title: 'Condition Values',
          content: OBJECTIVE1_HINT_MSG3,
        },
      ],
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
