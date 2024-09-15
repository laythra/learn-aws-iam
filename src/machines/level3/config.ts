import { groupedByIdEdges } from './edges';
import { GroupNodeID } from './nodes/group-nodes';
import { PolicyNodeID } from './nodes/policy-nodes';
import { ResourceNodeID } from './nodes/resource-nodes';
import cloudfrontReadPolicySchema from './schemas/policy/cloudfront-read-policy-schema.json';
import s3ReadPolicySchema from './schemas/policy/s3-read-policy-schema.json';
import s3ReadWritePolicySchema from './schemas/policy/s3-read-write-policy-schema.json';
import { MANAGED_POLICIES } from '../config';
import type {
  PopoverTutorialMessage,
  PopupTutorialMessage,
  LevelObjective,
  EdgeConnectionObjective,
} from '../types';
import { IAMNodeEntity, IAMPolicyNodeData, IAMPolicyRoleCreationObjective } from '@/types';
import { getEdgeName } from '@/utils/names';

const POPUP_MSG_1 = `
Every policy we have used so far was **AWS Managed**.

* **AWS Managed** policies are pre-built policies that you can attach
 to your IAM \`users\`, \`groups\`, and \`roles\`.
* They are designed to cover common use cases and are maintained by AWS.
* They cannot be edited, only attached or detached.
`;

const POPUP_MSG_2 = `
**Customer Managed** Policies are policies that you create and manage yourself.

* You create them as \`JSON\` documents and attach them
to your IAM \`users\`, \`groups\`, or \`roles\`.
* They give you more control over the permissions you grant as they are customized by you.
`;

const POPUP_MSG_3 = `
Policies whether **AWS Managed** or **Customer Managed** have the same structure:
* **Effect**: Whether the policy allows or denies the access
* **Action**: The specific actions that the policy allows or denies
* **Resource**: The resources to which the policy applies

~~~js
{
  Version: '2012-10-17',
  Statement: [
    {
      "Effect": "Allow", ::badge[ALLOWS SPECIFIED ACTIONS]::
      "Action": ['s3:Get*', 's3:List*'], ::badge[LISTING ALL OBJECTS AND BUCKETS]::
      "Resource": '*', ::badge[ALL S3 BUCKETS]::
    },
  ],
}|fullwidth,
~~~
`;

const POPUP_MSG_4 = `
You are a DevOps engineer responsible for managing the IAM policies for a small startup you work at.
|lg

\\
The company you work for has only two teams, the **Frontend** and **Backend** teams.
* **Frontend Team**:
  - Requires ***read/write*** access to specific \`S3\`
buckets for storing static assets, ie., images.
  - They also require a read access to specific \`CloudFront Distributions\` for monitoring the
assets content delivery.
* **Backend Team**:
  * Requires full access access to specific \`DynamoDB\` tables
  * Requires invoke access to specific \`Lambda\` functions
`;

const POPUP_MSG_5 = `
**Important thing to note:** We sometimes need to give backend developers access
to the same \`S3\` Buckets that frontend developers have access to.|lg

Ensure that you create policies that are reusable
while maintaining the **principle of least privilege**.|lg

\\
The **principle of least privilege** means giving users or systems
the minimum access they need to perform their tasks,
such as allowing a database administrator to view
but not modify financial records unless their job specifically requires it.
It's not an IAM exclusive concept, but rather a security best practice.
`;

const POPUP_MSG_6 = `
In case you hadn't noticed, the list of objectives you need
to complete is on the right side panel ➡️️|lg
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: 'iam_policy_1',
    popover_title: 'AWS Managed policies',
    popover_content: `This is an AWS Managed policy, click on the top right to see its contents`,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: 'new_entity_btn',
    popover_title: 'Your first Customer Managed Policy',
    popover_content: `Let's create your first Customer Managed Policy!`,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: 'iam_policy_2',
    popover_title: 'Your first Customer Managed Policy 🔥',
    popover_content: `
      You have created your first Customer Managed Policy!
      You can view its content and attach it to your IAM entities like an AWS managed one.
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'AWS Managed Policies',
    content: POPUP_MSG_1,
  },
  {
    title: 'Customer Managed Policies',
    content: POPUP_MSG_2,
  },
  {
    title: 'Policies Structure',
    content: POPUP_MSG_3,
  },
  {
    title: 'Your task as a DevOps engineer 👨‍💻️',
    content: POPUP_MSG_4,
  },
  {
    title: 'Your task as a DevOps engineer 👨‍💻',
    content: POPUP_MSG_5,
  },
  {
    title: "You're on your own now!",
    content: POPUP_MSG_6,
  },
];

export const LEVEL_OBJECTIVES: { [key: string]: LevelObjective } = {
  frontend_team_policy_1: {
    label: '**Frontend Team**: Read/Write access to S3 bucket `public-assets`',
    finished: false,
  },
  frontend_team_policy_2: {
    label: '**Frontend Team**: Read access to CloudFront Distribution `E1234567890ABC`',
    finished: false,
  },
  backend_team_policy_1: {
    label: '**Backend Team**: Read/Write access to DynamoDB table: `user-profiles`',
    finished: false,
  },
};
export const HIDDEN_LEVEL_OBJECTIVES: { [key: string]: LevelObjective } = {};
export const POLICY_ROLE_CREATION_OBJECTIVES: IAMPolicyRoleCreationObjective[][] = [
  [
    {
      entityId: PolicyNodeID.S3ReadWriteAcces,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadPolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      description:
        'Create a policy that allows read/write access\
          to the S3 bucket: public-assets',
      on_finish_event: 'S3_READ_POLICY_CREATED',
      validate_inside_code_editor: true,
      resource_affected: [],
    },
  ],
  [
    {
      entityId: PolicyNodeID.S3ReadWriteAcces,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadWritePolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: 'S3_READ_WRITE_POLICY_CREATED',
      validate_inside_code_editor: false,
      resource_affected: [ResourceNodeID.S3Bucket],
    },
    {
      entityId: PolicyNodeID.CloudfrontReadAccess,
      entity: IAMNodeEntity.Policy,
      json_schema: cloudfrontReadPolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: 'DYNAMO_DB_READ_WRITE_POLICY_CREATED',
      validate_inside_code_editor: false,
      resource_affected: [ResourceNodeID.DynamoDBTable],
    },
    {
      entityId: PolicyNodeID.DynamoDBReadWriteAccess,
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadWritePolicySchema,
      initial_code: MANAGED_POLICIES.EmptyPolicy,
      on_finish_event: 'CLOUDFRONT_DISTRIBUTION_READ_POLICY_CREATED',
      validate_inside_code_editor: false,
      resource_affected: [ResourceNodeID.CloudFront],
    },
  ],
];

export const EDGE_CONNECTION_OBJECTIVES: EdgeConnectionObjective[][] = [
  [
    {
      required_edges: [
        groupedByIdEdges[getEdgeName(PolicyNodeID.S3ReadWriteAcces, GroupNodeID.FrontendGroup)],
      ],
      locked_edges: [],
      on_finish_event: 'S3_READ_WRITE_POLICY_CONNECTED',
    },
    {
      required_edges: [
        groupedByIdEdges[getEdgeName(PolicyNodeID.CloudfrontReadAccess, GroupNodeID.FrontendGroup)],
      ],
      locked_edges: [],
      on_finish_event: 'CLOUDFRONT_READ_POLICY_CONNECTED',
    },
    {
      required_edges: [
        groupedByIdEdges[
          getEdgeName(PolicyNodeID.DynamoDBReadWriteAccess, GroupNodeID.BackendGroup)
        ],
      ],
      locked_edges: [],
      on_finish_event: 'DYNAMO_DB_READ_WRITE_POLICY_CONNECTED',
    },
  ],
];

export const INITIAL_POLICIES_INFO: Pick<
  IAMPolicyNodeData & { position: { x: string; y: string } },
  'id' | 'label' | 'code' | 'resources_affected' | 'position' | 'initial_position'
>[] = [
  {
    id: 'iam_policy_1',
    label: 's3-read-access',
    code: JSON.stringify(MANAGED_POLICIES.AWSS3ReadOnlyAccess, null, 2),
    resources_affected: [],
    initial_position: 'center',
    position: { x: '100', y: '100' },
  },
];
