import _ from 'lodash';

import { INITIAL_POLICIES } from '../policy_role_documents/initial-policies';
import rdsSharedManagePolicySchema from '../schemas/policy/rds-shared-manage-policy.json';
import rds1ManagePolicySchema from '../schemas/policy/rds1-manage-policy.json';
import rds2managePolicySchema from '../schemas/policy/rds2-manage-policy.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/objectives-factory';
import { IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

const OBJECTIVE_CALLOUT_MSG = `
  We ultimately want to create two policies that allow connecting to the RDS instances
  and managing them, but only if the user the same tag as the RDS instance.

  ~~~js
  "Condition": {
    "Bool": { ::badge[CONDITION OPERATOR]::
      "aws:MultiFactorAuthPresent": "false" ::badge[CONDITION KEY AND VALUE]::
    }
  }|fullwidth
  ~~~

  Consult the hints below if you need further help
`;

const HINT_MSG1 = `
  Remember the condition operators we discussed earlier?

  For this objective, we want to perform a strict string match,
  what do you think is the best suited operator?
`;

const HINT_MSG2 = `
  The condition key we need to define should represent the
  resource tag that is associated with the RDS instance, and the value should be
  the tag value that matches the user tag.

  The most commonly used condition keys for this purpose are:

  - **\`aws:ResourceTag/<tag-key>\`**: checks if the resource has a specific tag key and value.
  - **\`aws:RequestTag/<tag-key>\`**: checks if the request has a specific tag key and value.
`;

const HINT_MSG3 = `
  The missing action in the policy would allow listing all RDS instances.
  You can use the \`rds:DescribeDBInstances\` action for this purpose.
`;

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  _.zip(
    [PolicyNodeID.RDSManagePolicy1, PolicyNodeID.RDSManagePolicy2],
    [rds1ManagePolicySchema, rds2managePolicySchema],
    [ResourceNodeID.RDS1, ResourceNodeID.RDS2],
    [
      PolicyCreationFinishEvent.RDS1_MANAGE_POLICY_CREATED,
      PolicyCreationFinishEvent.RDS2_MANAGE_POLICY_CREATED,
    ]
  )
    .map(
      ([policyNodeId, schema, resourceNodeId, finishEvent]) =>
        ({
          type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
          entity_id: policyNodeId,
          entity: IAMNodeEntity.Policy,
          json_schema: schema,
          on_finish_event: finishEvent,
          validate_inside_code_editor: true,
          validate_function: AJV_COMPILER.compile(schema!),
          initial_code: INITIAL_POLICIES.SEPARATE_RDS_POLICY,
          limit_new_lines: false,
          created_node_initial_position: 'center',
          granted_accesses: [
            {
              target_node: resourceNodeId!,
              access_level: AccessLevel.Read,
              target_handle: 'bottom',
              source_handle: 'top',
            },
          ],
          callout_message: OBJECTIVE_CALLOUT_MSG,
          hint_messages: [
            {
              title: 'Condition Operator',
              content: HINT_MSG1,
            },
            {
              title: 'Condition Key',
              content: HINT_MSG2,
            },
            {
              title: 'Action to List RDS Instances',
              content: HINT_MSG3,
            },
          ],
          help_badges: [
            {
              path: 'Statement[0].Action',
              content: 'Place an action here that helps listing all RDS instances',
              color: 'yellow',
            },
          ],
        }) satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>
    )
    .map(objective => createPolicyCreationObjective(objective)),
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.RDSSharedPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: rdsSharedManagePolicySchema,
      on_finish_event: PolicyCreationFinishEvent.RDS_SHARED_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(rdsSharedManagePolicySchema),
      initial_code: INITIAL_POLICIES.SHARED_RDS_POLICY,
      limit_new_lines: false,
      created_node_initial_position: 'center',
      granted_accesses: [
        {
          target_node: ResourceNodeID.RDS1,
          access_level: AccessLevel.Read,
          target_handle: 'right',
          source_handle: 'left',
        },
        {
          target_node: ResourceNodeID.RDS2,
          access_level: AccessLevel.Read,
          target_handle: 'right',
          source_handle: 'left',
        },
      ],
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
