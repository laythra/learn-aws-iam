import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/types/objective-types';

const Objective1Description = `
  Create a policy that allows users tagged \`alpha-team\`
  to describe and connect only to matching RDS instances.
`;

const Objective2Description = `
  Similarly, create a policy that allows users tagged \`beta-team\`
  to describe and connect only to matching RDS instances.
`;

const Objective3Description = `
  Replace the two previous policies with one shared policy.
  It should allow both \`alpha-team\` and \`beta-team\` tagged users
  to describe and connect only to matching RDS instances.
`;

const Objective1Hint = `
  How do we know which RDS instance belongs to which user?
  The answer is in the tags. Users tagged \`alpha-team\` should
  only be able to describe and connect to RDS instances tagged \`alpha-team\`.
`;

const Objective2Hint = `
  Similar to the previous objective, users tagged \`beta-team\`
  should only be able to describe and connect to RDS instances tagged \`beta-team\`.
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_ACCESS_FOR_ALPHA_TEAM,
      label: Objective1Description,
      hint_text: Objective1Hint,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_ACCESS_FOR_BETA_TEAM,
      label: Objective2Description,
      hint_text: Objective2Hint,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_ACCESS_WITH_SHARED_POLICY,
      label: Objective3Description,
    },
  ],
];
