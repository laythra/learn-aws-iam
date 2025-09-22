import ec2RoleTrustPolicySchema from '../schemas/policy/ec2-role-trust-policy.json';
import { FinishEventMap, RoleCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, RoleNodeID } from '../types/node-id-enums';
import { createRoleCreationObjective } from '@/factories/objectives-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import { IAMRoleCreationObjective, ObjectiveType } from '@/machines/types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const ROLE_CREATION_OBJECTIVES: IAMRoleCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: 'role-2',
      finished: false,
      type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
      entity_id: RoleNodeID.S3WriteAccessRole,
      entity: IAMNodeEntity.Role,
      json_schema: ec2RoleTrustPolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: RoleCreationFinishEvent.EC2_ROLE_CREATED,
      layout_group_id: CommonLayoutGroupID.BottomCenterVertical,
      validate_function: AJV_COMPILER.compile(ec2RoleTrustPolicySchema),
      required_policies: [],
      required_principles: [],
      created_node_parent_id: AccountID.InLevelStagingAccount,
    } satisfies Partial<IAMRoleCreationObjective<FinishEventMap>>,
  ].map(objective => createRoleCreationObjective(objective)),
];
