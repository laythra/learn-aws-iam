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

const OBJECTIVE2_CALLOUT_MSG = `
  The goal of this objective is to create a Service Control Policy (SCP) that restricts access
  to the secret resource for any user who has a tag with the key \`role\` and the value \`junior\`.
  Achieving this requires the \`Condition\` element in the policy.

  Below is a brief overview of the \`Condition\` element in IAM policies:

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  For the operators, the most commonly used ones are:
  \`StringEquals\`, \`StringLike\`, \`Bool\`, and \`NumericEquals\`.

  The tricky part is figuring out the correct condition key to use.
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
    } satisfies Partial<IAMSCPCreationObjective<FinishEventMap>>,
  ].map(objective => createSCPCreationObjective(objective)),
];
