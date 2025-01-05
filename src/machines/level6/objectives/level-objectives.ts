import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types';

const Objective1Description = `
  Create an IAM policy inside the destination account \`258376635577\`
  which allows read access to the DynamoDB table \`FinanceReports\`
`;

const Objective2Description = `
  Create a role to be assumed by the IAM user \`richard\` in the account \`472578417785\`
`;

const Objective3Description = `
  Create an IAM policy which allows the IAM user \`richard\` in the account \`472578417785\`
  to assume the role created in the previous objective inside the account \`258376635577\`
`;

const Objective4Description = `
  Grant read access to the IAM user \`richard\` in the account \`472578417785\`
  to the DynamoDB table \`FinanceReports\`
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_DESTINATION_POLICY,
      label: Objective1Description,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_IAM_USER_ROLE,
      label: Objective2Description,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_IAM_POLICY_FOR_ASSUMING_ROLE,
      label: Objective3Description,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_READ_ACCESS_TO_THIRD_PARTY_USER,
      label: Objective4Description,
    },
  ],
];
