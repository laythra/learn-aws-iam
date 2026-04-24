import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/types/objective-types';

const Objective1Description = `
  Create a **resource-based policy** that allows *read*
  access to the **S3 bucket** \`compliance-audit-trail\`.
`;

const Objective2Description = `
  Create an **identity-based policy** in the *Trusted Account*
  that allows the **IAM user** \`alex\` to read/write
  to the **S3 bucket** \`incident-response-artifacts\`.
`;

const Objective3Description = `
  Attach that **identity-based policy** to the **IAM user** \`alex\`
  in the *Trusted Account*.
`;

const Objective4Description = `
  Create a **resource-based policy** in the *Trusting Account*
  that allows \`alex\` to read/write
  to the **S3 bucket** \`incident-response-artifacts\`.
`;

const OBJECTIVE2_HINT = `
  \`s3:GetObject\` allows reading. Which action enables writing?

  - \`s3:DeleteObject\`
  - \`s3:ListBucket\`
  - \`s3:PutObject\`
  - \`s3:ListAllMyBuckets\`
`;

const OBJECTIVE3_HINT = `
  After creating the policy, connect it to the user node.
  This grants the user identity-side permission.
`;

const OBJECTIVE4_HINT = `
  This policy must include a \`Principal\` for \`alex\`.
  Cross-account access requires both identity-side and resource-side permission.
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATED_TUTORIAL_RESOURCE_BASED_POLICY,
      label: Objective1Description,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATED_IN_LEVEL_IDENTITY_POLICY,
      label: Objective2Description,
      hint_text: OBJECTIVE2_HINT,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ATTACHED_IDENTITY_BASED_POLICY_TO_USER,
      label: Objective3Description,
      hint_text: OBJECTIVE3_HINT,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATED_IN_LEVEL_RESOURCE_BASED_POLICY,
      label: Objective4Description,
      hint_text: OBJECTIVE4_HINT,
    },
  ],
];
