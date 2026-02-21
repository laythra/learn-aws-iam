import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, PolicyNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/levels/consts';
import {
  IAMPermissionPolicyCreationObjective,
  ObjectiveType,
} from '@/levels/types/objective-types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';

export const POLICY_CREATION_OBJECTIVES: IAMPermissionPolicyCreationObjective<FinishEventMap>[][] =
  [
    [
      {
        id: PolicyNodeID.InsideLevelIdentityBasedPolicy,
        type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
        entity: IAMNodeEntity.Policy,
        on_finish_event: PolicyCreationFinishEvent.IN_LEVEL_IDENTITY_POLICY_CREATED,
        initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
        account_id: AccountID.TrustedAccount,
        limit_new_lines: false,
        layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
        extra_data: {
          granted_accesses: [],
        },
      } satisfies Partial<IAMPermissionPolicyCreationObjective<FinishEventMap>>,
    ].map(objective => createPolicyCreationObjective(objective)),
  ];
