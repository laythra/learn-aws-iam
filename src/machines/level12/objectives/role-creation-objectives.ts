import { FinishEventMap, RoleCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, RoleNodeID } from '../types/node-id-enums';
import { createRoleCreationObjective } from '@/factories/nodes_creation_objectives/role-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import { IAMRoleCreationObjective, ObjectiveType } from '@/machines/types/objective-types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types';

export const ROLE_CREATION_OBJECTIVES: IAMRoleCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: RoleNodeID.S3WriteAccessRole,
      finished: false,
      type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
      entity: IAMNodeEntity.Role,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: RoleCreationFinishEvent.EC2_ROLE_CREATED,
      layout_group_id: CommonLayoutGroupID.BottomCenterVertical,
      extra_data: {
        required_policies: [],
        required_principles: [],
      },
      created_node_parent_id: AccountID.InLevelStagingAccount,
      account_id: AccountID.InLevelStagingAccount,
    } satisfies Partial<IAMRoleCreationObjective<FinishEventMap>>,
  ].map(objective => createRoleCreationObjective(objective)),
];
