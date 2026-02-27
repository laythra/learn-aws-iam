import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/levels/types/objective-types';

const Objective1Description = `
  Create an **IAM Role** in the *Trusting Account* to be assumed by the **IAM User** \`omar\`.
`;

const Objective2Description = `
  Create a **permissions policy** that allows anyone assuming that role
  to read from the **DynamoDB table** \`finance-reports\`.
`;

const Objective3Description = `
  Create an **IAM policy** in the *Trusted Account* that allows
  the **IAM User** \`omar\` to assume the role in the *Trusting Account*.
`;

const Objective4Description = `
  Grant \`omar\` *read* access to the **DynamoDB table** \`finance-reports\`.
`;

const OBJECTIVE1_HINT = `
  The role's **trust policy** must include the **IAM User** \`omar\` as a trusted principal.

  This role will eventually let its principals access the **DynamoDB table**.

  Which account should contain the role: *Trusted* or *Trusting*?
`;

const OBJECTIVE2_HINT = `
  To model full *read* access for this level, include all of these actions:
  - \`dynamodb:GetItem\`
  - \`dynamodb:Query\`
  - \`dynamodb:Scan\`
  - \`dynamodb:DescribeTable\`
`;

const OBJECTIVE3_HINT = `
  Use \`sts:AssumeRole\` for this policy action.


`;

const OBJECTIVE4_HINT = `
  One connection must originate in the *Trusted Account*
  and point to an identity in the *Trusting Account*.
  Which connection is that?
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_IAM_USER_ROLE,
      label: Objective1Description,
      hint_text: OBJECTIVE1_HINT,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_DESTINATION_POLICY,
      label: Objective2Description,
      hint_text: OBJECTIVE2_HINT,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_IAM_POLICY_FOR_ASSUMING_ROLE,
      label: Objective3Description,
      hint_text: OBJECTIVE3_HINT,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.GRANT_READ_ACCESS_TO_THIRD_PARTY_USER,
      label: Objective4Description,
      hint_text: OBJECTIVE4_HINT,
    },
  ],
];
