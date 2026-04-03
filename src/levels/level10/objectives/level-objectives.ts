import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/types/objective-types';

const Objective1Description = `
  Create a policy that lets teams launch tagged EC2 instances,
  enforcing that every new instance carries the correct \`application\`, \`environment\`,
  and \`Name\` tags.
`;

const Objective2Description = `
  Attach the EC2 launch policy to the engineering group.
`;

const Objective3Description = `
  Create a policy that lets teams start and stop their own EC2 instances,
  but not those belonging to other teams.
`;

const Objective4Description = `
  Attach the EC2 management policy to the engineering group.
`;

const Objective1Hint = `
  The policy needs three statements — the third is pre-filled for you.

  **1. Tag Creation Statement**

  \`ec2:CreateTags\`, restricted to fire only during a \`RunInstances\` call.
  This is necessary because EC2 applies tags via a separate API call at launch time.

  **2. Instance Launch Statement**

  \`ec2:RunInstances\` on \`arn:aws:ec2:*:*:instance/*\`, allowed only when the request carries:
  * \`application\` — must match the caller's own application tag
  * \`environment\` — must be one of \`dev\`, \`staging\`, or \`prod\`
  * \`Name\` — optional, but if included must be one of the allowed tag keys

  **3. Supporting Resources Statement** *(pre-filled)*

  \`ec2:RunInstances\` on the ancillary resources EC2 provisions at launch time:
  subnets, network interfaces, security groups, volumes, and AMIs.
  No tag conditions — leave it as-is.
`;

const Objective3Hint = `
  Each EC2 instance carries an \`application\` tag. Use that to restrict
  which users can act on it.
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ALLOW_CREATE_EC2_WITH_TAGS_POLICY,
      label: Objective1Description,
      hint_text: Objective1Hint,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ATTACH_POLICY1_TO_GROUPS,
      label: Objective2Description,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_MANAGE_EC2_POLICY,
      label: Objective3Description,
      hint_text: Objective3Hint,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ATTACH_POLICY2_TO_GROUPS,
      label: Objective4Description,
    },
  ],
];
