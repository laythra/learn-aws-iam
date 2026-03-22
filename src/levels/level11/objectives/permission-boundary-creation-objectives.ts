import { GuardRailsBlockedEdgesFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { FinishEventMap, PermissionBoundaryCreationFinishEvent } from '../types/finish-event-enums';
import { PermissionBoundaryID } from '../types/node-ids';
import { createPermissionBoundaryCreationObjective } from '@/levels/utils/factories/permission-boundary-creation-objective-factory';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMPermissionBoundaryCreationObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE_CALLOUT_MSG = `
  This objective requires creating a permission boundary which caps the permissions to:
  * Reading Secrets' Values
  * Retrieving Secrets Metadata

  **ONLY** if the secrets are tagged with the same \`team\` tag the user making the request has
`;

const ACTIONS_HINT_MSG = `
  We should have two actions here:

  * \`secretsmanager:GetSecretValue\`
  * \`secretsmanager:DescribeSecret\`
`;

const CONDITIONS1_HINT_MSG = `
  Recall the conditions structure we discussed in previous levels? Below is a refresher:

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  We need to ensure here that the user can only read secrets carrying the same \`team\` tag.

  ***If you're really stuck, consult the final hint message.***
`;

const CONDITIONS2_HINT_MSG = `
  For this specific permission boundary, the conditions will look something like this:

  ~~~js
  "Condition": {
    "StringEquals": {
      "secretsmanager:ResourceTag/team": "???"
    }
  }|fullwidth
  ~~~

  The missing value here is the team tag of the user making the request.

  ***Remember the Policy Variables we covered in the last level?
  This is where they come into play.***
`;

export const PERMISSION_BOUNDARY_CREATION_OBJECTIVES: IAMPermissionBoundaryCreationObjective<
  FinishEventMap,
  GuardRailsBlockedEdgesFnName
>[][] = [
  [
    {
      id: PermissionBoundaryID.SecretsReadingPermissionBoundary,
      type: ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.PermissionBoundary,
      on_finish_event:
        PermissionBoundaryCreationFinishEvent.READ_SECRETS_PERMISSION_BOUNDARY_CREATED,
      initial_code: INITIAL_POLICIES.READ_SECRETS_PERMISSION_BOUNDARY,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
      extra_data: {
        blocked_edge_content: 'Access Blocked By Permission Boundary 🔒',
        is_edge_blocked_fn_name: 'permissionBoundary2BlockingFn',
      },
      callout_message: OBJECTIVE_CALLOUT_MSG,
      hint_messages: [
        {
          title: 'Actions',
          content: ACTIONS_HINT_MSG,
        },
        {
          title: 'Conditions - Part 1',
          content: CONDITIONS1_HINT_MSG,
        },
        {
          title: 'Conditions - Part 2',
          content: CONDITIONS2_HINT_MSG,
        },
      ],
    } satisfies Partial<
      IAMPermissionBoundaryCreationObjective<FinishEventMap, GuardRailsBlockedEdgesFnName>
    >,
  ].map(objective => createPermissionBoundaryCreationObjective(objective)),
];
