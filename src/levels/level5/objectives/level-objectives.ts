import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/levels/types/objective-types';

const TutorialObjective1Description = `
  Make the **IAM User** \`finance-user\` assume the **IAM Role** \`finance-auditor-role\`
`;

const TutorialObjective2Description = `
  Create a new role that can be assumed by \`finance-user\`
  and attach the **IAM Policy** \`s3-read-policy\` to it
`;

const TutorialObjective3Description = `
  Grant the IAM User \`finance-user\` read access
  to the S3 Bucket \`financial-reports\` through the IAM Role you just created
`;

const InLevelObjective1Description = `
  Grant the **EC2 Instance** write access into the **S3 Bucket** \`chat-images\`
`;

const InLevelObjective2Description = `
  Grant the **Lambda Function** full read access
  from the **S3 Bucket** \`chat-images\`
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ATTACH_USER_TO_TUTORIAL_ROLE,
      label: TutorialObjective1Description,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_TUTORIAL_ROLE,
      label: TutorialObjective2Description,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_TUTORIAL_S3_READ_ACCESS,
      label: TutorialObjective3Description,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_EC2_S3_WRITE_ACCESS,
      label: InLevelObjective1Description,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_LAMBDA_S3_READ_ACCESS,
      label: InLevelObjective2Description,
    },
  ],
];
