import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types';

const Objective1Description = `
  Create a policy which allows \`team-peach\` tagged users
   to describe and connect to their own RDS instances
`;

const Objective2Description = `
  Similiary, Create a policy which allows
  \`bowser-force\` tagged users to describe and connect to their own RDS instances
`;

const Objective3Description = `
  We want to conflate the two previous objectives into a single shared policy.
  This policy should allow both \`team-peach\` and \`bowser-force \` tagged users
  to describe and connect to their own RDS instances.
`;

const Objective1Hint = `
  How do we know which RDS instance belongs to which user?
  The answer lies in the tags! Users tagged with \`team-peach\` should
  only be able to describe and connect to RDS instances that are also tagged with \`team-peach\`.
`;

const Objective2Hint = `
  Similiar to the previous objective, users tagged with \`bowser-force\`
  should only be able to describe and connect to RDS instances that are also tagged with \
  \`bowser-force\`.
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
