import { FinishEventMap, TrustPolicyEditFinishEvent } from '../types/finish-event-enums';
import { RoleNodeID } from '../types/node-id-enums';
import { IAMTrustPolicyEditObjective, ObjectiveType } from '@/levels/types/objective-types';
import { IAMNodeEntity } from '@/types/iam-enums';

export const TRUST_POLICY_EDIT_OBJECTIVES: IAMTrustPolicyEditObjective<FinishEventMap>[][] = [
  [
    {
      id: RoleNodeID.FinanceAuditorRole,
      type: ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE,
      entity: IAMNodeEntity.Role,
      on_finish_event: TrustPolicyEditFinishEvent.TUTORIAL_TRUST_POLICY_EDITED,
    },
  ],
];
