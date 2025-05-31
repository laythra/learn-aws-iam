import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import tutorialPolicySchema from '../schemas/policy/tutorial-permission-policy-schema.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/objectives-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

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
      // callout_message: OBJECTIVE2_CALLOUT_MSG,
      // hint_messages: [
      //   {
      //     title: 'Hint #1',
      //     content: OBJECTIVE2_HINT_MSG1,
      //   },
      //   {
      //     title: 'Hint #2',
      //     content: OBJECTIVE2_HINT_MSG2,
      //   },
      // ],
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
