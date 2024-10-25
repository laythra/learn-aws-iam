import { NodeCreationFinishEvent } from '../types/finish-event-enums';
import { IAMUserGroupCreationObjective } from '@/machines/types';
import { IAMNodeEntity } from '@/types';

// prettier-ignore
export const USER_GROUP_CREATION_OBJECTIVES: IAMUserGroupCreationObjective<NodeCreationFinishEvent>[] =
  [
    {
      finished: false,
      entity_to_create: IAMNodeEntity.User,
      on_finish_event: NodeCreationFinishEvent.USER_NODE_CREATED,
    },
  ];
