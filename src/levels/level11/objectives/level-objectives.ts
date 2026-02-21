import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/levels/types/objective-types';

const Objective1Description = `
  Attach the S3 read policy to ***Sephiroth***
`;

const Objective2Description = `
  Create a permission boundary that limits access to reading secrets.
`;

const Objective3Description = `
  Create a permission policy that allows attaching and detaching policies to specific roles.
`;

const Objective2Hint = `
  Keep in mind: Permission Boundaries are just policy documents
  and follow the same structure as IAM policies.
`;

const Objective3Hint = `
  The target role must have the permission boundary from the previous step attached to it.
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ATTACH_TUTORIAL_S3_POLICY,
      label: Objective1Description,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_PERMISSION_BOUNDARY,
      label: Objective2Description,
      hint_text: Objective2Hint,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_PERMISSIONS_DELEGATION_POLICY,
      label: Objective3Description,
      hint_text: Objective3Hint,
    },
  ],
];
