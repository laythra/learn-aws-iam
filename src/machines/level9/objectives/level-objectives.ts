import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types';

const Objective1Description = `
  Create your first **Service Control Policy (SCP)**
  which should prevent reading any secret from the **Secrets Manager**
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
      id: LevelObjectiveID.CREATE_TUTORIAL_SCP,
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
