import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types';

const Objective1Description = `
  Grant the user \`satoru\` terminate access
  to the **EC2** instances which were created by him
`;

const Objective2Description = `
  Create an **Service Control Policy (SCP)** to prevent the user \`Clark\`
  from reading any secret from the **Secrets Manager**
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_TUTORIAL_USER_EC2_TERMINATE_ACCESS,
      label: Objective1Description,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_IN_LEVEL_SCP,
      label: Objective2Description,
    },
  ],
];
