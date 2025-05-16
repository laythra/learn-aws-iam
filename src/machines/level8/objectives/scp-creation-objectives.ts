import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import tutorialSCPSchema from '../schemas/policy/scp-tutorial-policy-schema.json';
import { FinishEventMap, SCPCreationFInishEvent } from '../types/finish-event-enums';
import { ResourceNodeID, SCPNodeID, UserNodeID } from '../types/node-id-enums';
import { createSCPCreationObjective } from '@/factories/objectives-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMSCPCreationObjective, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';
import { getEdgeName } from '@/utils/names';

const OBJECTIVE1_HINT_MSG1 = `
  Remember, the Effect can be either Allow or Deny.
`;

const OBJECTIVE1_HINT_MSG2 = `
  The Action which is being used to grant
  access to the secrets is \`secretsmanager:GetSecretValue\`.
`;

export const SCP_CREATION_OBJECTIVES: IAMSCPCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.SCP_CREATION_OBJECTIVE,
      entity_id: SCPNodeID.TutorialSCP,
      entity: IAMNodeEntity.SCP,
      json_schema: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: SCPCreationFInishEvent.TUTORIAL_SCP_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(tutorialSCPSchema),
      initial_code: INITIAL_POLICIES.TUTORIAL_SCP,
      limit_new_lines: false,
      created_node_initial_position: 'left-center',
      blocked_accesses: [
        ResourceNodeID.TutorialSecret1,
        ResourceNodeID.TutorialSecret2,
        ResourceNodeID.TutorialSecret3,
      ].map(secretId => getEdgeName(UserNodeID.TutorialFirstUser, secretId)),
      initial_edges: [],
      help_badges: [
        {
          path: 'Statement[0].Effect',
          content: 'We want to limit access here, is Allow the right choice?',
          color: 'yellow',
        },
        {
          path: 'Statement[0].Action',
          content: 'We want to block read access for all secrets',
          color: 'yellow',
        },
      ],
      hint_messages: [
        {
          title: 'Hint #1',
          content: OBJECTIVE1_HINT_MSG1,
        },
        {
          title: 'Hint #2',
          content: OBJECTIVE1_HINT_MSG2,
        },
      ],
    } as Partial<IAMSCPCreationObjective<FinishEventMap>>,
  ].map(objective => createSCPCreationObjective(objective)),
];
