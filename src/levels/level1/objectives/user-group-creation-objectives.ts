import { FinishEventMap, NodeCreationFinishEvent } from '../types/finish-event-enums';
import { UserNodeID } from '../types/node-id-enums';
import { IAMUserGroupCreationObjective, ObjectiveType } from '@/levels/types/objective-types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';

export const USER_GROUP_CREATION_OBJECTIVES: IAMUserGroupCreationObjective<FinishEventMap>[] = [
  {
    type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE,
    finished: false,
    entity_to_create: IAMNodeEntity.User,
    entity_id: UserNodeID.FirstUser,
    on_finish_event: NodeCreationFinishEvent.USER_NODE_CREATED,
    layout_group_id: CommonLayoutGroupID.TopCenterHorizontal,
    alert_message: 'Connect the IAM Policy to this IAM User',
  },
];
