import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import inLevelSCPSchema from '../schemas/policy/scp-in-level-policy-schema.json';
import { FinishEventMap, SCPCreationFInishEvent } from '../types/finish-event-enums';
import { ResourceNodeID, SCPNodeID, UserNodeID } from '../types/node-id-enums';
import { createSCPCreationObjective } from '@/factories/objectives-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMSCPCreationObjective, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';
import { getEdgeName } from '@/utils/names';

const OBJECTIVE2_HINT_MSG1 = `
  Should we use \`Allow\` or \`Deny\` for the Effect?
`;

const OBJECTIVE2_HINT_MSG2 = `
  To apply the SCP for users whose names start with a specific prefix,
  We can use the \`StringLike\` condition operator alongside the \`aws:username\` condition key.
`;

const OBJECTIVE2_CALLOUT_MSG = `
  There are quite a few conditition operators and keys available for writing IAM policies,
  here are some of the most common ones:
  * **Bool**: Evaluates to true or false.
  * **StringEquals**: Checks if a string matches a specific value.
  * **StringLike**: Checks if a string matches a pattern (supports wildcards).
  * **NumericEquals**: Checks if a numeric value matches a specific number.

  You can find the full list in the [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html).
`;

export const SCP_CREATION_OBJECTIVES: IAMSCPCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.SCP_CREATION_OBJECTIVE,
      entity_id: SCPNodeID.InLevelAccountSCP,
      entity: IAMNodeEntity.SCP,
      json_schema: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: SCPCreationFInishEvent.IN_LEVEL_SCP_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(inLevelSCPSchema),
      initial_code: INITIAL_POLICIES.IN_LEVEL_INITIAL_SCP,
      limit_new_lines: false,
      created_node_initial_position: 'top-left',
      blocked_accesses: [
        getEdgeName(UserNodeID.JuniorClark, ResourceNodeID.InLevelSecret1),
        getEdgeName(UserNodeID.JuniorDiana, ResourceNodeID.InLevelSecret1),
      ],
      initial_edges: [],
      callout_message: OBJECTIVE2_CALLOUT_MSG,
      hint_messages: [
        {
          title: 'Hint #1',
          content: OBJECTIVE2_HINT_MSG1,
        },
        {
          title: 'Hint #2',
          content: OBJECTIVE2_HINT_MSG2,
        },
      ],
    } satisfies Partial<IAMSCPCreationObjective<FinishEventMap>>,
  ].map(objective => createSCPCreationObjective(objective)),
];
