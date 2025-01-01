import financeAuditorRoleSchema from '../schemas/role/finance-auditor-role-schema.json';
import { FinishEventMap, TrustPolicyEditFinishEvent } from '../types/finish-event-enums';
import { RoleNodeID } from '../types/node-id-enums';
import { IAMTrustPolicyEditObject, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const TRUST_POLICY_EDIT_OBJECTIVES: IAMTrustPolicyEditObject<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE,
      entity: IAMNodeEntity.Role,
      entity_id: RoleNodeID.FinanceAuditorRole,
      json_schema: financeAuditorRoleSchema,
      on_finish_event: TrustPolicyEditFinishEvent.TUTORIAL_TRUST_POLICY_EDITED,
      validate_function: AJV_COMPILER.compile(financeAuditorRoleSchema),
    },
  ],
];
