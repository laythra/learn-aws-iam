import { LevelObjectiveID } from '../types/objective-enums';
import type { LevelObjective } from '../types/state-machine-types';

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID>[] = [
  {
    id: LevelObjectiveID.DeveloperAnalyticsDataReadAccess,
    label: `**Developers** should only have read access (GetItem)
to the \`AnalyticsData\``,
    finished: false,
  },
  {
    id: LevelObjectiveID.DataScientistS3ReadWriteAccess,
    label: `**Data Scientists** should be able to read/write objects
from/to the \`timeshift-assets\` S3 Bucket`,
    finished: false,
  },
  {
    id: LevelObjectiveID.InternS3ReadAccess,
    label: `**Interns** should only have read access to the \`timeshift-assets\` S3 Bucket`,
    finished: false,
  },
];
