import { FinishEventMap, LevelObjectiveFinishEvent } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { ObjectiveType, type LevelObjective } from '@/machines/types';

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: 'Create your first customer managed policy',
      finished: false,
      id: LevelObjectiveID.CreateFirstCustomerManagedPolicy,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: '**Frontend Team**: Read/Write access to S3 bucket `public-assets`',
      finished: false,
      id: LevelObjectiveID.FrontendTeamS3BucketAccess,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: '**Frontend Team**: Read access to CloudFront Distribution `E1234567890ABC`',
      finished: false,
      id: LevelObjectiveID.FrontendTeamCloudFrontAccess,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: '**Backend Team**: Read/Write access to DynamoDB table: `user-profiles`',
      finished: false,
      id: LevelObjectiveID.BackendTeamDynamoDBAccess,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
    },
  ],
];
