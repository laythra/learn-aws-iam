import type { LevelObjective } from '../types/state-machine-types';

export enum LevelObjectiveID {
  DeveloperAnalyticsDataReadAccess = 'developer_analytics_data_read_access',
  DataScientistS3ReadWriteAccess = 'data_scientist_s3_read_write_access',
  InternS3ReadAccess = 'intern_s3_read_access',
}

export const LEVEL_OBJECTIVES: LevelObjective[] = [
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
