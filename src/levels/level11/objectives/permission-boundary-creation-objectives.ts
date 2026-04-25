import { INITIAL_POLICIES } from '../initial-policies';
import { GuardRailsBlockedEdgesFnName } from '../level-runtime-fns';
import { FinishEventMap, PermissionBoundaryCreationFinishEvent } from '../types/finish-event-enums';
import { PermissionBoundaryID } from '../types/node-ids';
import { createPermissionBoundaryCreationObjective } from '@/levels/utils/factories/permission-boundary-creation-objective-factory';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMPermissionBoundaryCreationObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE_CALLOUT_MSG = `
  In AWS, **permission boundaries** aren’t a separate type of policy.
  They’re just normal IAM policies.
  You create them the same way, the only difference is how you attach them.
  When attached as a **permission boundary**,
  they act as a maximum permissions limit instead of granting permissions.

  For the sake of simplicity, **permission boundaries** in this simulation are created separately
  in order to make attaching them to roles and users more intuitive.
`;

const ACTIONS_HINT_MSG = `
  We should have two actions here:

  * \`secretsmanager:GetSecretValue\`
  * \`secretsmanager:DescribeSecret\`
`;

const OBJECTIVE_MSG = `
  This objective requires creating a **permission boundary** which caps the permissions to:
  * Reading Secrets Values
  * Retrieving Secrets Metadata

  only if the secrets are tagged with the same \`team\` tag the user making the request has
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
  For this specific **permission boundary**, the conditions will look something like this:

  ~~~js
  "Condition": {
    "StringEquals": {
      "secretsmanager:ResourceTag/team": "???"
    }
  }|fullwidth
  ~~~

  The missing value here is the team tag of the user making the request.

  Remember the **Policy Variables** we covered in the last level? This is where they come into play.
`;

const OBJECTIVE1_HELP_BADGES = [
  {
    path: '/Statement/0/Action',
    content: 'Limit to reading/describing secrets',
    color: 'yellow',
  },
  {
    path: '/Statement/0/Condition',
    content: 'Apply only to resources with matching team tag',
    color: 'yellow',
  },
];

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
          title: 'Objective Details',
          content: OBJECTIVE_MSG,
        },
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
      help_badges: OBJECTIVE1_HELP_BADGES,
    } satisfies Partial<
      IAMPermissionBoundaryCreationObjective<FinishEventMap, GuardRailsBlockedEdgesFnName>
    >,
  ].map(objective => createPermissionBoundaryCreationObjective(objective)),
];
