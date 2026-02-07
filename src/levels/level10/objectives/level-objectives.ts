import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/levels/types/objective-types';

const Objective1Description = `
  Create a policy containing two statements, one for managing RDS instances with specific tags,
  and another for allowing tag creation when creating RDS instances.
`;

const Objective2Description = `
  Attach the RDS creation policy to the appropriate team groups.
`;

const Objective3Description = `
  Create a policy that allows stopping/starting RDS instances,
  but only by the team to whom the instance belongs.
`;

const Objective4Description = `
  Attach the RDS management policy to the respective team groups.
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

const Objective3Hint = `
  How can you know the team to which the RDS instance belongs?
  We can utilize **Resource Tags** to achieve this!
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
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ATTACH_POLICY1_TO_GROUPS,
      label: Objective2Description,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_MANAGE_RDS_POLICY,
      label: Objective3Description,
      hint_text: Objective3Hint,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ATTACH_POLICY2_TO_GROUPS,
      label: Objective4Description,
    },
  ],
];
