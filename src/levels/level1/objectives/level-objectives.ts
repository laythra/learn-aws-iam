import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/types/objective-types';

const OBJECTIVE_MSG1 = `
  Connect \`public-images\` policy to the **IAM User** named \`alex\`
`;

const OBJECTIVE_MSG2 = `
  Create your own **IAM User**
`;

const OBJECTIVE_MSG3 = `
  Grant your **IAM User** *read access* to the **S3 bucket** \`public-images\`
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[] = [
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    finished: false,
    id: LevelObjectiveID.ConnectionTutorialPolicyToTutorialUser,
    label: OBJECTIVE_MSG1,
  },
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    finished: false,
    id: LevelObjectiveID.CreateIAMUser,
    label: OBJECTIVE_MSG2,
  },
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    finished: false,
    id: LevelObjectiveID.GrantIAMUserReadAccessToS3Bucket,
    label: OBJECTIVE_MSG3,
  },
];
