import { EC2_ROLE_ALERT_MESSAGE } from '../tutorial_messages/node-tooltip-messages';
import { FinishEventMap, RoleCreationFinishEvent } from '../types/finish-event-enums';
import { AccountID, RoleNodeID } from '../types/node-ids';
import { MANAGED_POLICIES } from '@/domain/managed-policies';
import { createRoleCreationObjective } from '@/levels/utils/factories/role-creation-objective-factory';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMRoleCreationObjective, ObjectiveType } from '@/types/objective-types';

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
      node_tooltip: EC2_ROLE_ALERT_MESSAGE,
      extra_data: {
        required_policies: [],
        required_principles: [],
      },
      created_node_parent_id: AccountID.InLevelStagingAccount,
      account_id: AccountID.InLevelStagingAccount,
    } satisfies Partial<IAMRoleCreationObjective<FinishEventMap>>,
  ].map(objective => createRoleCreationObjective(objective)),
];
