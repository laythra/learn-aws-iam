import { FinishEventMap, LevelObjectiveFinishEvent } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { ObjectiveType, type LevelObjective } from '@/machines/types';

const OBJECTIVE_MSG1 = `
  Create your first customer managed policy
`;

const OBJECTIVE_MSG2 = `
  **Frontend Team**: Allow Read/Write access to S3 bucket \`public-assets\`
`;

const OBJECTIVE_MSG3 = `
  **Frontend Team**: Allow Read access to CloudFront Distribution \`E1234567890ABC\`
`;

const OBJECTIVE_MSG4 = `
  **Backend Team**: Allow Read/Write access to DynamoDB table: \`user-profiles\`
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: OBJECTIVE_MSG1,
      finished: false,
      id: LevelObjectiveID.CreateFirstCustomerManagedPolicy,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: OBJECTIVE_MSG2,
      finished: false,
      id: LevelObjectiveID.FrontendTeamS3BucketAccess,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: OBJECTIVE_MSG3,
      finished: false,
      id: LevelObjectiveID.FrontendTeamCloudFrontAccess,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: OBJECTIVE_MSG4,
      finished: false,
      id: LevelObjectiveID.BackendTeamDynamoDBAccess,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
    },
  ],
];
