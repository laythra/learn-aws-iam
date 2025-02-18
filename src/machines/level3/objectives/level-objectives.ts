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

const OBJECTIVE2_HINT = `
  Writing to an S3 bucket requires the following permissions:
  - \`s3:PutObject\`

  Reading from an S3 bucket requires the following permissions:
  - \`s3:GetObject\`
`;

const OBJECTIVE3_HINT = `
  Reading from a CloudFront distribution requires the following permissions:
  - \`cloudfront:GetDistribution\`
  - \`cloudfront:GetDistributionConfig\`
`;

const OBJECTIVE4_HINT = `
  Reading from a **DynamoDB table** requires the following permissions:
  - \`dynamodb:GetItem\` ::badge[SINGLE ITEM LOOKUP]::
  - \`dynamodb:Query\` ::badge[FILTERED MULTI-ITEM FETCH]::

  Writing to a **DynamoDB table** requires the following permissions:
  - \`dynamodb:PutItem\` ::badge[FOR INSERT]::
  - \`dynamodb:UpdateItem\` ::badge[FOR UPDATE]::
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
      hint_text: OBJECTIVE2_HINT,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: OBJECTIVE_MSG3,
      finished: false,
      id: LevelObjectiveID.FrontendTeamCloudFrontAccess,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
      hint_text: OBJECTIVE3_HINT,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      label: OBJECTIVE_MSG4,
      finished: false,
      id: LevelObjectiveID.BackendTeamDynamoDBAccess,
      on_finish_event: LevelObjectiveFinishEvent.LEVEL_OBJECTIVE_FINISHED,
      hint_text: OBJECTIVE4_HINT,
    },
  ],
];
