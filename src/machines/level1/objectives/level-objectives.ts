import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective } from '@/machines/types';

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID>[] = [
  {
    finished: false,
    id: LevelObjectiveID.CreateIAMUser,
    label: 'Create an IAM user',
  },
  {
    finished: false,
    id: LevelObjectiveID.GrantIAMUserReadAccessToS3Bucket,
    label: 'Grant IAM user read access to S3 bucket',
  },
];
