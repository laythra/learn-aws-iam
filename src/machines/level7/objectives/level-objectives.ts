import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/machines/types/objective-types';

const Objective1Description = `
  Create a **Resource Based Policy** which allows *read*
  access to the **S3 Bucket** \`public-images\`
`;

const Objective2Description = `

  Create an **Identity Based Policy** in the *Originating Account* which should allow
  the **IAM User** \`leon-kennedy\` to read/write to the **S3 Bucket** \`public-images\`
`;

const Objective3Description = `
  Grant the **IAM User** \`leon-kennedy\` in the *Trusted Account* the ability to
  read/write to the **S3 Bucket** \`rpd-case-files\` by attaching the previously created
  **Identity Based Policy**
`;

const Objective4Description = `
  Create a **Resource Based Policy** which
  allows *read/write* access to the **S3 Bucket** \`public-images\`
`;

const OBJECTIVE2_HINT = `
  \`s3:GetObject\` allows reading. what about writing?

  - \`s3:DeleteObject\`
  - \`s3:ListBucket\`
  - \`s3:PutObject\`
  - \`s3:ListAllMyBuckets\`
`;

const OBJECTIVE3_HINT = `
  The created **Policy** should be identical
  to the resource based policy we created in the previous step, with the exception of one field.
`;

const OBJECTIVE4_HINT = `
  A pretty straightforward task, do we need to to establish a cross-account connection here?
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_TUTORIAL_RESOURCE_BASED_POLICY,
      label: Objective1Description,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_IN_LEVEL_IDENTITY_POLICY,
      label: Objective2Description,
      hint_text: OBJECTIVE2_HINT,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ATTACH_IDENTITY_BASED_POLICY_TO_USER,
      label: Objective4Description,
      hint_text: OBJECTIVE4_HINT,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_IN_LEVEL_RESOURCE_BASED_POLICY,
      label: Objective3Description,
      hint_text: OBJECTIVE3_HINT,
    },
  ],
];
