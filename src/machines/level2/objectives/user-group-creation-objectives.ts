import { FinishEventMap, UserGroupCreationFinishEvent } from '../types/finish-event-enums';
import { GroupNodeID, UserNodeID } from '../types/node-id-enums';
import { IAMUserGroupCreationObjective, ObjectiveType } from '@/machines/types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types';

export const USER_GROUP_CREATION_OBJECTIVES: IAMUserGroupCreationObjective<FinishEventMap>[] = [
  {
    entity_id: GroupNodeID.FirstGroup,
    type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE,
    finished: false,
    entity_to_create: IAMNodeEntity.Group,
    on_finish_event: UserGroupCreationFinishEvent.GroupCreated,
    layout_group_id: CommonLayoutGroupID.RightCenterHorizontal,
  },
  {
    entity_id: UserNodeID.SecondUser,
    type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE,
    finished: false,
    entity_to_create: IAMNodeEntity.User,
    on_finish_event: UserGroupCreationFinishEvent.UserCreated,
    layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
  },
];
