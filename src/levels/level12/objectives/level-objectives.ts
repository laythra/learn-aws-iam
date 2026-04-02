import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/types/objective-types';

const Objective1Description = `
  Block **CloudTrail** trail deletion across all accounts
`;

const Objective2Description = `
  Restrict **EC2** launches to \`us-east-1\` in the Staging Account
`;

const Objective3Description = `
  Allow the user belonging to the **devops** team to
  delegate \`ec2:RunInstances\` access via \`ec2-launch-role\`,
  without being able to exceed the role's intended permissions
`;

const Objective4Description = `
  Give **EC2** instances in the Staging Account write access to \`staging-artifacts\`
  using **GLACIER** storage
`;

const Objective5Description = `
  Let Production users manage **ElastiCache** replication groups
  that match their own squad tag
`;

const Objective2Hint = `
  The action is \`ec2:RunInstances\`. What type of policy restricts actions
  across an entire account? We just covered this.
`;

const Objective3Hint = `
  By delegation, we are referring to being able to attach and detach policies to the role.

  A **Permission Boundary** can cap what a role is allowed to do,
  even if someone attaches a broader policy to it later.

  You can consult the tags on the users to see which one belongs to the devops team.
`;

const Objective4Hint = `
  Service-to-service access is required here. We need to ensure that the policy granting the access
  has the \`s3:PutObject\` action, with a condition that
  requires the \`s3:x-amz-storage-class\` to be \`GLACIER\`.
`;

const Objective5Hint = `
  Users need permissions to modify, delete, and describe replication groups —
  but only for groups tagged with their own squad.

  - Modifying: \`elasticache:???\`
  - Deleting: \`elasticache:DeleteReplicationGroup\`
  - Describing: \`elasticache:???\`

  The condition should match the \`squad\` tag on the resource against the user's own \`squad\` tag.

  Still stuck on the actions? Check [here](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonelasticache.html).
`;

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.CREATE_CLOUDTRAIL_DELETION_RESTRICTING_SCP,
      label: Objective1Description,
    },
  ],
  [
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.RESTRICT_EC2_REGION,
      label: Objective2Description,
      hint_text: Objective2Hint,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.DELEGATE_EC2_LAUNCHING,
      label: Objective3Description,
      hint_text: Objective3Hint,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ENABLE_EC2_TO_S3_COMMUNICATION,
      label: Objective4Description,
      hint_text: Objective4Hint,
    },
    {
      type: ObjectiveType.LEVEL_OBJECTIVE,
      finished: false,
      id: LevelObjectiveID.ELASTICACHE_ACCESS_MANAGEMENT,
      label: Objective5Description,
      hint_text: Objective5Hint,
    },
  ],
];
