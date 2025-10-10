import { generateAssumeRolePolicySchema } from '../schemas/policy/assume-role-policy-schema';
import dynamodbReadPolicySchema from '../schemas/policy/dynamodb-read-policy-schema.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID, RoleNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import { AccountID, IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { AccessLevel, CommonLayoutGroupID, IAMNodeEntity } from '@/types';
import { generateArn } from '@/utils/arn-generator';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: PolicyNodeID.TrustingAccountFinanceReportsReadPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.TrustingAccountFinanceReportsReadPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: dynamodbReadPolicySchema,
      on_finish_event: PolicyCreationFinishEvent.DYNAMODB_READ_POLICY_CREATED,
      validate_inside_code_editor: true,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      extra_data: {
        granted_accesses: [
          {
            access_level: AccessLevel.Read,
            target_node: ResourceNodeID.TrustingAccountDynamoDBTable,
            target_handle: 'right',
          },
        ],
      },
      validate_function: AJV_COMPILER.compile(dynamodbReadPolicySchema),
      limit_new_lines: false,
      account_id: AccountID.Trusting,
      layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
    {
      id: PolicyNodeID.TrustedAccountAssumeRolePolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.TrustedAccountAssumeRolePolicy,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.ASSUME_ROLE_POLICY_CREATED,
      validate_inside_code_editor: true,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      get_validate_function: nodes => {
        const roleNode = nodes.find(
          node => node.data.id === RoleNodeID.TrustingAccountDynamoDBReadRole
        );

        if (!roleNode) return;

        const roleArn = generateArn(IAMNodeEntity.Role, roleNode.data.label);
        return AJV_COMPILER.compile(generateAssumeRolePolicySchema(roleArn));
      },
      extra_data: {
        granted_accesses: [],
      },
      limit_new_lines: false,
      account_id: AccountID.Trusted,
      layout_group_id: CommonLayoutGroupID.RightCenterHorizontal,
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
