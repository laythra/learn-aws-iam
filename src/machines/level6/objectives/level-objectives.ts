import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types/objective-types';

const Objective1Description = `
  Create an **IAM Role** to be assumed by the **IAM User** \`omar\`.
`;

const Objective2Description = `
  Create a **Permission Policy** which should allow anyone assuming the **IAM Role**
  from the previous step to read from the **DynamoDB table** \`finance-reports\`
`;

const Objective3Description = `
  Create an **IAM Policy** in the *Trusted Account* which should allow
  the **IAM User** \`omar\` to assume the **IAM Role** in the *Trusting Account*
`;

const Objective4Description = `
  Grant the \`omar\` *Read* access to the **DynamoDB Table** \`finance-reports\`
`;

const OBJECTIVE1_HINT = `
  The **IAM Role** Should have the **IAM User** \`omar\` as the **Trusted Entity**.

  This **Role** will ultimately allow its principles to access the **DynamoDB Table**.

  Where should the **Role** be created? In the *Trusted Account* or the *Trusting Account*?
`;

const OBJECTIVE2_HINT = `
  Which of these actions do you believe is necessary to achieve full *read access*?
  - \`dynamodb:GetItem\`
  - \`dynamodb:Query\`
  - \`dynamodb:Scan\`
  - \`dynamodb:DescribeTable\`
  - \`dynamodb:ConditionCheckItem\`
`;

const OBJECTIVE3_HINT = `
  Use the action: \`sts:AssumeRole\` to achieve this.
`;

const OBJECTIVE4_HINT = `
  There's one connection that's going to originate from
  the *Trusted Account* to the *Trusting Account*.
  Which one is it?
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
