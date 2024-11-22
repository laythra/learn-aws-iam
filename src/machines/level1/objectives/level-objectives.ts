import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types';

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[] = [
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    finished: false,
    id: LevelObjectiveID.CreateIAMUser,
    label: 'Create an IAM user',
  },
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    finished: false,
    id: LevelObjectiveID.GrantIAMUserReadAccessToS3Bucket,
    label: 'Grant IAM user read access to S3 bucket',
  },
];
