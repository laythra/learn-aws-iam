import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types';

const Objective1Description = `
  Grant the **EC2 Instance** write access into the **S3 Bucket** \`users-certificates\`
`;

const Objective2Description = `
  Grant the **Lambda Function** full read access
  from the **S3 Bucket** \`users-certificates\`
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_EC2_S3_WRITE_ACCESS,
      label: Objective1Description,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_LAMBDA_S3_READ_ACCESS,
      label: Objective2Description,
    },
  ],
];
