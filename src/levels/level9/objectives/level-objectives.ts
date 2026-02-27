import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/levels/types/objective-types';

const Objective1Description = `
  Create a policy that allows users tagged \`peach-team\`
  to describe and connect only to matching RDS instances.
`;

const Objective2Description = `
  Similarly, create a policy that allows users tagged \`bowser-force\`
  to describe and connect only to matching RDS instances.
`;

const Objective3Description = `
  Replace the two previous policies with one shared policy.
  It should allow both \`peach-team\` and \`bowser-force\` tagged users
  to describe and connect only to matching RDS instances.
`;

const Objective1Hint = `
  How do we know which RDS instance belongs to which user?
  The answer is in the tags. Users tagged \`peach-team\` should
  only be able to describe and connect to RDS instances tagged \`peach-team\`.
`;

const Objective2Hint = `
  Similar to the previous objective, users tagged \`bowser-force\`
  should only be able to describe and connect to RDS instances tagged \`bowser-force\`.
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_ACCESS_FOR_TEAM_PEACH,
      label: Objective1Description,
      hint_text: Objective1Hint,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_ACCESS_FOR_BOWSER_FORCE,
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
