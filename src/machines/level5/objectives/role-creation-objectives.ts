import { INITIAL_TRUST_POLICIES } from '../policy_role_documents/initial-roles';
import ec2RoleSchema from '../schemas/role/ec2-role-schema.json';
import financeAuditorPolicySchema from '../schemas/role/finance-auditor-role-schema.json';
import lambdaRoleSchema from '../schemas/role/lambda-role-schema.json';
import { FinishEventMap, RoleCreationFinishEvent } from '../types/finish-event-enums';
import { RoleNodeID } from '../types/node-id-enums';
import { createRoleCreationObjective } from '@/factories/nodes_creation_objectives/role-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMRoleCreationObjective, ObjectiveType } from '@/machines/types';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

const HINT_MSG1 = `
  Grant the **EC2 Instance** write access into the **S3 Bucket** \`users-certificates\`
`;

const HINT_MSG2 = `
  Grant the **Lambda Function** full read access
  from the **S3 Bucket** \`chat-images\`
`;

const CALLOUT_MSG1 = `
  What you're creating now is called a **Trust Policy**.
  It's another type of policy that defines which IAM entities can assume the role.

  a trust policy can be attached to one role at time,
  so it's embedded in the role itself
`;

const CALLOUT_MSG2 = `
  The \`Principal\` field in a **Trust Policy** supports multiple formats:

  - **IAM principals**:
    \`{ "AWS": "<iam_user_or_role_arn>" }\`
    – Grants access to a specific IAM user, role, or account.

  - **Service principals**:
    \`{ "Service": "lambda.amazonaws.com" }\`
    – Grants access to an AWS service.
      This pattern works for **any AWS service**, e.g. \`ec2.amazonaws.com\`,
      \`ecs.amazonaws.com\`, etc.

    These formats allow you to define **who can assume the role**
    — whether it's a human, an application, or an AWS service.
`;

const HINT_MESSAGES = [
  {
    title: 'Objective #1',
    content: HINT_MSG1,
  },
  {
    title: 'Objective #2',
    content: HINT_MSG2,
  },
];

export const ROLE_CREATION_OBJECTIVES: IAMRoleCreationObjective<FinishEventMap>[][] = [
  [
    {
      id: RoleNodeID.S3ReadAccessRole,
      type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
      entity_id: RoleNodeID.S3ReadAccessRole,
      entity: IAMNodeEntity.Role,
      json_schema: financeAuditorPolicySchema,
      initial_code: INITIAL_TRUST_POLICIES.TUTORIAL_ROLE_TRUST_POLICY2,
      on_finish_event: RoleCreationFinishEvent.TUTORIAL_ROLE_CREATED,
      layout_group_id: CommonLayoutGroupID.LeftCenterHorizontal,
      validate_inside_code_editor: true,
      callout_message: CALLOUT_MSG1,
      help_badges: [
        {
          path: '/Statement/0/Effect',
          content: 'Allows the specified actions on the target resources',
          color: 'green',
        },
        {
          path: '/Statement/0/Action',
          content: 'Allow the Principle to assume the role',
          color: 'green',
        },
        {
          path: '/Statement/0/Principal/AWS',
          content: 'The IAM user ARN that can assume the role',
          color: 'green',
        },
      ],
      validate_function: AJV_COMPILER.compile(financeAuditorPolicySchema),
      extra_data: {
        required_policies: [],
        required_principles: [],
      },
    } satisfies Partial<IAMRoleCreationObjective<FinishEventMap>>,
  ].map(objective => createRoleCreationObjective(objective)),
  [
    {
      id: RoleNodeID.EC2Role,
      type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
      entity_id: RoleNodeID.EC2Role,
      entity: IAMNodeEntity.Role,
      json_schema: ec2RoleSchema,
      initial_code: MANAGED_POLICIES.EmptyTrustPolicy,
      on_finish_event: RoleCreationFinishEvent.EC2_ROLE_CREATED,
      validate_inside_code_editor: true,
      help_badges: [],
      validate_function: AJV_COMPILER.compile(ec2RoleSchema),
      // required_policies: [],
      // required_principles: [],
      hint_messages: HINT_MESSAGES,
      callout_message: CALLOUT_MSG2,
      extra_data: {
        required_policies: [],
        required_principles: [],
      },
    } satisfies Partial<IAMRoleCreationObjective<FinishEventMap>>,
    {
      id: RoleNodeID.LambdaRole,
      type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
      entity_id: RoleNodeID.LambdaRole,
      entity: IAMNodeEntity.Role,
      json_schema: lambdaRoleSchema,
      initial_code: MANAGED_POLICIES.EmptyTrustPolicy,
      on_finish_event: RoleCreationFinishEvent.LAMBDA_ROLE_CREATED,
      validate_inside_code_editor: true,
      help_badges: [],
      validate_function: AJV_COMPILER.compile(lambdaRoleSchema),
      hint_messages: HINT_MESSAGES,
      callout_message: CALLOUT_MSG2,
      extra_data: {
        required_policies: [],
        required_principles: [],
      },
    } satisfies Partial<IAMRoleCreationObjective<FinishEventMap>>,
  ].map(objective => createRoleCreationObjective(objective)),
];
