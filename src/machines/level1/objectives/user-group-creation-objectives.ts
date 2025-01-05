import { FinishEventMap, NodeCreationFinishEvent } from '../types/finish-event-enums';
import { UserNodeID } from '../types/node-id-enums';
import { IAMUserGroupCreationObjective, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';

export const USER_GROUP_CREATION_OBJECTIVES: IAMUserGroupCreationObjective<FinishEventMap>[] = [
  {
    entity_id: UserNodeID.FirstUser,
    type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE,
    finished: false,
    entity_to_create: IAMNodeEntity.User,
    on_finish_event: NodeCreationFinishEvent.USER_NODE_CREATED,
    initial_position: 'left-center',
  },
];
