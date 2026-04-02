import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/types/objective-types';

const Objective1Description = `
  Create a policy that allows users tagged \`alpha-team\`
  to retrieve their team's database secret and execute statements
  against their team's **Aurora** cluster.
`;

const Objective2Description = `
  Similarly, create a policy that allows users tagged \`beta-team\`
  to retrieve their team's database secret and execute statements
  against their team's **Aurora** cluster.
`;

const Objective3Description = `
  Replace the two previous policies with one shared policy.
  It should allow both \`alpha-team\` and \`beta-team\` tagged users
  to retrieve their team's database secret and execute statements
  against their team's **Aurora** cluster.
`;

const Objective1Hint = `
  Use a condition to verify the calling user's **application** tag matches their team.
  The resource ARNs are already scoped to the alpha team's specific secret and cluster.
`;

const Objective2Hint = `
  Same idea as before, but for the beta team's resources.
  Use a condition on the calling user's **application** tag.
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
