import { FinishEventMap, PolicyCreationFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID } from '../types/node-id-enums';
import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { AccountID, IAMPolicyCreationObjective, ObjectiveType } from '@/machines/types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types';

export const RESOURCE_POLICY_CREATION_OBJECTIVES: IAMPolicyCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: PolicyNodeID.InsideLevelIdentityBasedPolicy,
      type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Policy,
      on_finish_event: PolicyCreationFinishEvent.IN_LEVEL_IDENTITY_POLICY_CREATED,
      initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
      account_id: AccountID.Trusted,
      limit_new_lines: false,
      layout_group_id: CommonLayoutGroupID.BottomRightHorizontal,
      extra_data: {
        granted_accesses: [],
      },
    } satisfies Partial<IAMPolicyCreationObjective<FinishEventMap>>,
  ].map(objective => createPolicyCreationObjective(objective)),
];
