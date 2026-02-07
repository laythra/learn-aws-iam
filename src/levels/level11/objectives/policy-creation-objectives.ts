import { ValidateFunctionsFnName } from '../level-runtime-fns';
import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import { FinishEventMap } from '../types/finish-event-enums';
import { PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { IAMPolicyCreationObjective } from '@/levels/types/objective-types';
import { CommonLayoutGroupID } from '@/types/iam-enums';

const CALLOUT_MSG = `
  This objective requires creating a policy which allows a user
  to delegate permissions to other users.

  Specifically, the policy should allow the user to attach and detach policies to any role resource.
  But **ONLY** if that resource has the permission boundary with
  the **ARN** of the permission boundary you created in the previous step
  attached
`;

const ACTIONS_HINT_MSG = `
  This policy allows the user to perform the following actions:

  - \`iam:AttachRolePolicy\`
  - \`iam:DetachRolePolicy\`
`;

const CONDITIONS1_HINT_MSG = `
  The condition should only attach attaching and detaching policies to roles which
  have the permission boundary with the ARN \`arn:aws:iam::123456789012:policy/ReadOnlyAccess\`
  attached

  Here's a quick refresher on the syntax:

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  ***If you're really stuck, consult the final hint message.***
`;

const CONDITIONS2_HINT_MSG = `
  For this specific policy, the conditions will look something like this:

  ~~~js
  "Condition": {
    "StringEquals": { "???": "arn:aws:iam::123456789012:role/secrets-reader-role"
    }
  }|fullwidth
  ~~~

  What's the missing condition key here?
`;

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<
  FinishEventMap,
  ValidateFunctionsFnName
>[][] = [
  [
    {
      id: PolicyNodeID.AccessDelegationPolicy,
      on_finish_event: PolicyCreationFinishEvent.ACCESS_DELEGATION_POLICY_CREATED,
      extra_data: {
        granted_accesses: [],
      },
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
      callout_message: CALLOUT_MSG,
      initial_code: INITIAL_POLICIES.DELEGATE_ACCESS_MANAGEMENT_POLICY,
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
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap, ValidateFunctionsFnName>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
