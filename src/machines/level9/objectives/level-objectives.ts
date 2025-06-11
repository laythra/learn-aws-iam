import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types';

const Objective1Description = `
  Allow **Senior** users only to read the secret \`Slack Integration Secret\`, by using
  the prefix \`senior-\` in their username.
`;

const Objective2Description = `
  Allow **Senior** users only to read the secret \`Slack Integration Secret\`, by using
  the tag \`role: senior\` in their user tags.
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
