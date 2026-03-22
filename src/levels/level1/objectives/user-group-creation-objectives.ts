import { FIRST_USER_ALERT_MESSAGE } from '../tutorial_messages/node-tooltip-messages';
import { FinishEventMap, NodeCreationFinishEvent } from '../types/finish-event-enums';
import { UserNodeID } from '../types/node-ids';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { IAMUserGroupCreationObjective, ObjectiveType } from '@/types/objective-types';

export const USER_GROUP_CREATION_OBJECTIVES: IAMUserGroupCreationObjective<FinishEventMap>[] = [
  {
    type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE,
    finished: false,
    entity_to_create: IAMNodeEntity.User,
    entity_id: UserNodeID.FirstUser,
    on_finish_event: NodeCreationFinishEvent.USER_NODE_CREATED,
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    node_tooltip: FIRST_USER_ALERT_MESSAGE,
  },
];
