import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types';

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      id: LevelObjectiveID.CreateIAMGroup,
      finished: false,
      label: 'Create an IAM Group',
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      id: LevelObjectiveID.MakeScalingEasier,
      finished: false,
      label: 'Make things easier to scale using the newly created group',
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      id: LevelObjectiveID.AttachUserToGroup,
      finished: false,
      label: 'Give your user access to all resources in one go',
    },
  ],
];
