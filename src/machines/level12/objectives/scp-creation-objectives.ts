import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import blockTrailDeletionScpSchema from '../schemas/policy/trails-deletion-scp.json';
import { FinishEventMap, SCPCreationFinishEvent } from '../types/finish-event-enums';
import { SCPNodeID } from '../types/node-id-enums';
import { createSCPCreationObjective } from '@/factories/nodes_creation_objectives/scp-creation-objective-factory';
import { IAMSCPCreationObjective, ObjectiveType } from '@/machines/types';
import { CommonLayoutGroupID } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

const OBJECTIVE_CALLOUT_MSG = `
  We need to create a Service Control Policy (SCP) which blocks the
  deletion of CloudTrail trails in all accounts.
`;

const EFFECT_HINT_MSG = `
  What should the effect be for this SCP?
  We want to ***Deny*** the deletion of CloudTrail trails.
`;

const ACTIONS_HINT_MSG = `
  The action we need to block is something like:
  \`cloudtrail:Delete???\`
`;

// eslint-disable-next-line max-len
export const SCP_CREATION_OBJECTIVES: IAMSCPCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: 'permission-boundary-1',
      initial_edges: [],
      type: ObjectiveType.SCP_CREATION_OBJECTIVE,
      entity_id: SCPNodeID.BlockCloudTrailDeletionSCP,
      json_schema: blockTrailDeletionScpSchema,
      on_finish_event: SCPCreationFinishEvent.BLOCK_CLOUDTRAIL_DELE1TION_SCP_CREATED,
      validate_function: AJV_COMPILER.compile(blockTrailDeletionScpSchema),
      initial_code: INITIAL_POLICIES.FIRST_SCP_OBJECTIVE_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.TopRightVertical,
      blocked_edge_content: 'Access Blocked By SCP 🔒',
      // Not using any external context because this function will get serialized
      is_edge_blocked: edge => {
        return (
          edge.data?.target_node.data.entity.toString() === 'AWS Resource' &&
          edge.data?.target_node.data.resource_type!.toString() === 'CloudTrail'
        );
      },
      callout_message: OBJECTIVE_CALLOUT_MSG,
      hint_messages: [
        {
          title: 'Effect',
          content: EFFECT_HINT_MSG,
        },
        {
          title: 'Actions',
          content: ACTIONS_HINT_MSG,
        },
      ],
    } satisfies Partial<IAMSCPCreationObjective<FinishEventMap>>,
  ].map(objective => createSCPCreationObjective(objective)),
];
