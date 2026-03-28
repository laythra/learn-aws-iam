import { FinishEventMap } from '../types/finish-event-enums';
import { LevelObjectiveID } from '../types/objective-enums';
import { LevelObjective, ObjectiveType } from '@/types/objective-types';

const Objective1Description = `
  Create an SCP that prevents the deletion of CloudTrails in every account
`;

const Objective2Description = `
  Allow EC2 instance creation only in the \`us-east-1\` region within the Staging Account.
`;

const Objective3Description = `
  Enable **DevOps** users to assign \`ec2:RunInstances\`
  permissions through the IAM Role \`ec2-launch-role\` to users belonging to the backend team,
  ensuring they cannot grant more permissions than intended.
`;

const Objective4Description = `
  In the **Staging Account**, ensure that EC2 instances upload logs and artifacts to the S3 bucket
  named \`staging-artifacts-bucket\`. The uploads must use the \`GLACIER\` storage class, specified
  in the \`s3:x-amz-storage-class\` Condition key.
`;

const Objective5Description = `
  Users in the **Production Account** should manage ElastiCache clusters
  tagged with their team name.
`;

const Objective2Hint = `
  The specific action here is \`ec2:RunInstances\`. What type of policy allows restricting
  actions across an entire AWS account?
`;
const Objective3Hint = `
  We can use permission boundaries to limit the maximum permissions a user can delegate.
`;

const Objective4Hint = `
  This scenario involves enabling communication between AWS resources.

  Achieving this objective is a two-step process:
  1. Create an IAM Role that can be assumed by EC2 instances
  2. Create a policy that allows the necessary S3 actions with the appropriate
     condition, and attach it to the role.

  For the required S3 permissions, you need a simple \`PutObject\` action. Remember to include
  the condition for the **storage class**.
`;

const Objective5Hint = `
  To manage ElastiCache clusters, users need permissions for:
  - Modifying the cluster: \`elasticache:???\`
  - Deleting the cluster: \`elasticache:DeleteCacheCluster\`
  - Describing the cluster: \`elasticache:???\`

  Use conditions to ensure users can only manage clusters which belong to their team,
  identified by the \`team\` tag.
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
