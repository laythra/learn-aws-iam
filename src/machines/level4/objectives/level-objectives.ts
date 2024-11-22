import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import type { LevelObjective } from '../types/state-machine-types';
import { ObjectiveType } from '@/machines/types';

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[] = [
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    id: LevelObjectiveID.DeveloperAnalyticsDataReadAccess,
    label: `**Developers** should only have read access (GetItem)
to the \`AnalyticsData\``,
    finished: false,
  },
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    id: LevelObjectiveID.DataScientistS3ReadWriteAccess,
    label: `**Data Scientists** should be able to read/write objects
from/to the \`timeshift-assets\` S3 Bucket`,
    finished: false,
  },
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    id: LevelObjectiveID.InternS3ReadAccess,
    label: `**Interns** should only have read access to the \`timeshift-assets\` S3 Bucket`,
    finished: false,
  },
];
