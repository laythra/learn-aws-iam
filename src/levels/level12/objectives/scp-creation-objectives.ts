import { GuardRailsBlockedEdgesFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { SCP_ALERT_MESSAGE } from '../tutorial_messages/node-tooltip-messages';
import { FinishEventMap, SCPCreationFinishEvent } from '../types/finish-event-enums';
import { SCPNodeID } from '../types/node-ids';
import { MANAGED_POLICIES } from '@/domain/managed-policies';
import { createSCPCreationObjective } from '@/levels/utils/factories/scp-creation-objective-factory';
import { CommonLayoutGroupID } from '@/types/iam-enums';
import { IAMSCPCreationObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE_DESCRIPTION = `
  We need to create a Service Control Policy (SCP) which blocks the
  deletion of CloudTrail trails in all accounts.
`;
const EFFECT_HINT_MSG = `
  What should the effect be for this SCP?
  We want to **Deny** the deletion of CloudTrail trails.
`;

const ACTIONS_HINT_MSG = `
  The action we need to block is something like:
  \`cloudtrail:Delete???\`
`;

export const SCP_CREATION_OBJECTIVES: IAMSCPCreationObjective<
  FinishEventMap,
  GuardRailsBlockedEdgesFnName
>[][] = [
  [
    {
      id: SCPNodeID.BlockCloudTrailDeletionSCP,
      type: ObjectiveType.SCP_CREATION_OBJECTIVE,
      on_finish_event: SCPCreationFinishEvent.BLOCK_CLOUDTRAIL_DELETION_SCP_CREATED,
      initial_code: INITIAL_POLICIES.FIRST_SCP_OBJECTIVE_POLICY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.TopRightVertical,
      node_tooltip: SCP_ALERT_MESSAGE,
      extra_data: {
        blocked_edge_content: 'Delete CloudTrail Access Blocked By SCP 🔒',
        is_edge_blocked_fn_name: 'SCP1BlockingFN',
      },
      hint_messages: [
        {
          title: 'Objective',
          content: OBJECTIVE_DESCRIPTION,
        },
        {
          title: 'Effect',
          content: EFFECT_HINT_MSG,
        },
        {
          title: 'Actions',
          content: ACTIONS_HINT_MSG,
        },
      ],
    } satisfies Partial<IAMSCPCreationObjective<FinishEventMap, GuardRailsBlockedEdgesFnName>>,
  ].map(objective => createSCPCreationObjective(objective)),
  [
    {
      id: SCPNodeID.RestrictEC2RegionSCP,
      type: ObjectiveType.SCP_CREATION_OBJECTIVE,
      on_finish_event: SCPCreationFinishEvent.RESTRICT_EC2_REGION_SCP_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.TopRightVertical,
      node_tooltip: SCP_ALERT_MESSAGE,
      extra_data: {
        blocked_edge_content: 'Access Blocked By SCP 🔒',
        is_edge_blocked_fn_name: 'SCP2BlockingFN',
      },
    } satisfies Partial<IAMSCPCreationObjective<FinishEventMap, GuardRailsBlockedEdgesFnName>>,
  ].map(objective => createSCPCreationObjective(objective)),
];
