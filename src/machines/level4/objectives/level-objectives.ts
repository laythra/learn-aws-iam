import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { ObjectiveType, type LevelObjective } from '@/machines/types';

const LEVEL_OBJECTIVE1 = `
**Developers** should have *read/write* access to the \`CustomerData\` **DynamoDB Table**
and *read/write* access to the \`timeshift-assets\` **S3 Bucket** Objects
`;

const LEVEL_OBJECTIVE2 = `
**Data Scientists** should be able to read/write objects
from/to the \`timeshift-assets\` **S3 Bucket**
and read/write to the \`analytics-data\` **DynamoDB Table**
`;

const LEVEL_OBJECTIVE3 = `
**Interns** should only have read access to the \`timeshift-assets\` **S3 Bucket**
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[] = [
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    id: LevelObjectiveID.DeveloperAnalyticsDataReadAccess,
    label: LEVEL_OBJECTIVE1,
    finished: false,
  },
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    id: LevelObjectiveID.DataScientistS3ReadWriteAccess,
    label: LEVEL_OBJECTIVE2,
    finished: false,
  },
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    id: LevelObjectiveID.InternS3ReadAccess,
    label: LEVEL_OBJECTIVE3,
    finished: false,
  },
];
