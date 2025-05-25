import s3ReadWriteIdentityPolicySchema from '../schemas/policy/\
s3-read-write-identity-policy-schema.json';
import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/objectives-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { AccountID, IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const RESOURCE_POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity_id: PolicyNodeID.InsideLevelIdentityBasedPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadWriteIdentityPolicySchema,
      on_finish_event: PolicyCreationFinishEvent.IN_LEVEL_IDENTITY_POLICY_CREATED,
      validate_inside_code_editor: true,
      validate_function: AJV_COMPILER.compile(s3ReadWriteIdentityPolicySchema),
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      account_id: AccountID.Trusted,
      limit_new_lines: false,
      created_node_initial_position: 'bottom-right',
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
