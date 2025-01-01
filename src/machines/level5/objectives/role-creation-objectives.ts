import { INITIAL_TRUST_POLICIES } from '../policy_role_documents/initial-roles';
import ec2RoleSchema from '../schemas/role/ec2-role-schema.json';
import financeAuditorPolicySchema from '../schemas/role/finance-auditor-role-schema.json';
import lambdaRoleSchema from '../schemas/role/lambda-role-schema.json';
import { FinishEventMap, RoleCreationFinishEvent } from '../types/finish-event-enums';
import { RoleNodeID } from '../types/node-id-enums';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMRoleCreationObjective, ObjectiveType } from '@/machines/types';
import { IAMNodeEntity } from '@/types';
import { AJV_COMPILER } from '@/utils/iam-code-linter';

export const ROLE_CREATION_OBJECTIVES: IAMRoleCreationObjective<FinishEventMap>[][] = [
  [
    {
      type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
      entity_id: RoleNodeID.S3ReadAccessRole,
      entity: IAMNodeEntity.Role,
      json_schema: financeAuditorPolicySchema,
      initial_code: INITIAL_TRUST_POLICIES.TUTORIAL_ROLE_TRUST_POLICY2,
      on_finish_event: RoleCreationFinishEvent.TUTORIAL_ROLE_CREATED,
      validate_inside_code_editor: true,
      help_badges: [
        {
          path: 'Statement[0].Effect',
          content: 'Allows the specified actions on the target resources',
          color: 'green',
        },
        {
          path: 'Statement[0].Action',
          content: 'Allow the Principle to assume the role',
          color: 'green',
        },
        {
          path: 'Statement[0].Principal.AWS',
          content: 'The IAM user ARN that can assume the role',
          color: 'green',
        },
      ],
      validate_function: AJV_COMPILER.compile(financeAuditorPolicySchema),
      required_policies: [],
      required_principles: [],
    },
  ],
  [
    {
      type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
      entity_id: RoleNodeID.EC2Role,
      entity: IAMNodeEntity.Role,
      json_schema: ec2RoleSchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: RoleCreationFinishEvent.EC2_ROLE_CREATED,
      validate_inside_code_editor: false,
      help_badges: [],
      validate_function: AJV_COMPILER.compile(ec2RoleSchema),
      required_policies: [],
      required_principles: [],
    },
    {
      type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
      entity_id: RoleNodeID.LambdaRole,
      entity: IAMNodeEntity.Role,
      json_schema: lambdaRoleSchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: RoleCreationFinishEvent.LAMBDA_ROLE_CREATED,
      validate_inside_code_editor: false,
      help_badges: [],
      validate_function: AJV_COMPILER.compile(lambdaRoleSchema),
      required_policies: [],
      required_principles: [],
    },
  ],
];
