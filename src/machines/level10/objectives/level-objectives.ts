import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types';

const Objective1Description = `
  Create a policy containing two statements, one for managing RDS instances with specific tags,
  and another for allowing tag creation when creating RDS instances.
`;

const Objective1Hint = `
  The policy should include two statements:

  **1. Tag Creation Statement**

  Allows teams to create tags **only** when creating a new RDS instance

  **2. RDS Instance Creation Statement**

  Allows teams to create RDS instances, while **enforcing** the presence of the following tags:

  * \`team\` - Must match the principal's team name
  * \`environment\` - Must be one of: \`dev\`, \`staging\`, or \`prod\`
  * \`name\` - Can be any descriptive name for the RDS instance
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ALLOW_CREATE_RDS_WITH_TAGS_POLICY,
      label: Objective1Description,
      hint_text: Objective1Hint,
    },
  ],
];
