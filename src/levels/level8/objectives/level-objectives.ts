import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/types/objective-types';

const Objective1Description = `
  Allow only **Senior** users to read \`Slack Integration Secret\`
  by explicitly listing their ARNs in the condition.
`;

const Objective2Description = `
  Allow only **Senior** users to read \`Slack Integration Secret\`
  by checking the principal tag \`role: senior\`.
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.EDIT_POLICY_FIRST_TIME,
      label: Objective1Description,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.EDIT_POLICY_SECOND_TIME,
      label: Objective2Description,
    },
  ],
];
