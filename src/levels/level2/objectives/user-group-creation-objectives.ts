import { GROUP_ALERT_MESSAGE } from '../tutorial_messages/node-tooltip-messages';
import { FinishEventMap, UserGroupCreationFinishEvent } from '../types/finish-event-enums';
import { GroupNodeID, UserNodeID } from '../types/node-id-enums';
import { IAMUserGroupCreationObjective, ObjectiveType } from '@/levels/types/objective-types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';

export const USER_GROUP_CREATION_OBJECTIVES: IAMUserGroupCreationObjective<FinishEventMap>[] = [
  {
    type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE,
    finished: false,
    entity_id: GroupNodeID.FirstGroup,
    entity_to_create: IAMNodeEntity.Group,
    on_finish_event: UserGroupCreationFinishEvent.GroupCreated,
    layout_group_id: CommonLayoutGroupID.RightCenterHorizontal,
    node_tooltip: GROUP_ALERT_MESSAGE,
  },
  {
    type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE,
    finished: false,
    entity_to_create: IAMNodeEntity.User,
    entity_id: UserNodeID.SecondUser,
    on_finish_event: UserGroupCreationFinishEvent.UserCreated,
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
  },
];
