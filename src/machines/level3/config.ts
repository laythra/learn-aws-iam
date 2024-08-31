import s3ReadPolicySchema from './schemas/policy/s3-read-policy-schema.json';
import { MANAGED_POLICIES } from '../config';
import type { PopoverTutorialMessage, PopupTutorialMessage, LevelObjective } from '../types';
import {
  IAMNodeEntity,
  IAMPolicyNodeData,
  IAMResourceNodeData,
  IAMScriptableEntitiesCreationObjective,
  IAMUserNodeData,
} from '@/types';

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
    popover_title: 'Your first customer managed policy!',
    popover_content: `You have created your first customer managed policy
      This policy can be attached to any IAM entity.`,
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
];

export const LEVEL_OBJECTIVES: { [key: string]: LevelObjective } = {};
export const HIDDEN_LEVEL_OBJECTIVES: { [key: string]: LevelObjective } = {};
export const SCRIPTABLE_ENTITIES_CREATION_OBJECTIVES: IAMScriptableEntitiesCreationObjective[][] = [
  [
    {
      entity: IAMNodeEntity.Policy,
      json_schema: s3ReadPolicySchema,
      initial_code: MANAGED_POLICIES.AWSS3ReadOnlyAccess,
      description:
        'Create a policy that allows read access\
          to the S3 bucket: staging-public-images',
      on_finish_event: 'S3_READ_POLICY_CREATED',
      validate_inside_code_editor: true,
    },
  ],
];

export const INITIAL_RESOURCES_INFO: Pick<
  IAMResourceNodeData,
  'id' | 'label' | 'entity' | 'image'
>[] = [];

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

export const INITIAL_USERS_INFO: Pick<IAMUserNodeData, 'id' | 'label'>[] = [];
