import { LevelObjectiveID } from './types/objective-enums';
import {
  type PopoverTutorialMessage,
  type PopupTutorialMessage,
  type LevelObjective,
  type BaseFinishEventMap,
  ObjectiveType,
} from '../types';
import {
  AccessLevel,
  IAMNodeImage,
  IAMNodeResourceEntity,
  IAMPolicyNodeData,
  IAMResourceNodeData,
  IAMUserNodeData,
} from '@/types';
import { PartialWithRequired } from '@/types/common';

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: 'new_entity_btn',
    popover_title: 'IAM Groups',
    popover_content: `Let's create an IAM group`,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: 'identity_creation_select',
    popover_title: `Select the group type`,
    popover_content: ``,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: 'iam_identity_name',
    popover_title: `It goes without saying, but each group needs a name`,
    popover_content: ``,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: 'iam_group_1',
    popover_title: `Attaching Policies/Users`,
    popover_content: `
      Remember, you can attach policies and users to your IAM group.
    `,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'start',
  },
  {
    element_id: 'iam_user_1',
    popover_title: `Nice! 🔥`,
    popover_content: `
      Notice how the IAM user inherited the policies attached to the group.
    `,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'start',
  },
  {
    element_id: 'iam_user_2',
    popover_title: `There you have it!`,
    popover_content: `
      Your new user directly inherited the policies attached to the group in one go.
      Adding team members is now a breeze!
    `,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'start',
  },
];

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'IAM Groups',
    content: `
      It's time to scale things up a bit. You'll see that we have multiple policies
      laying around here, and attached to your IAM user
    `,
  },
  {
    title: 'IAM Groups',
    content: `
      We would like to create a new IAM user for a new team member that will join your team,
      and we want to make sure that they have the same permissions as you do. Attaching policies
      to individual IAM users can be a bit cumbersome, so we're going to create an IAM group
      to make things easier
    `,
  },
  {
    title: 'IAM Groups',
    content: `
      Attaching policies to individual IAM users can be a bit cumbersome,
      so we're going to create an IAM group to make things easier.
    `,
  },
  {
    title: 'IAM Groups',
    content: `
      IAM groups are a way to manage permissions for multiple IAM users. You can attach policies
      to an IAM group, and all IAM users in that group will inherit those permissions.
      shall we begin?
    `,
  },
];

export interface FinishEventMap extends BaseFinishEventMap {
  [ObjectiveType.EDGE_CONNECTION_OBJECTIVE]: never;
  [ObjectiveType.POLICY_ROLE_CREATION_OBJECTIVE]: never;
  [ObjectiveType.POLICY_ROLE_EDIT_OBJECTIVE]: never;
  [ObjectiveType.LEVEL_OBJECTIVE]: never;
  [ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE]: never;
}

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[] = [
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    id: LevelObjectiveID.CreateIAMGroup,
    finished: false,
    label: 'Create an IAM Group',
  },
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    id: LevelObjectiveID.MakeScalingEasier,
    finished: false,
    label: 'Make things easier to scale using the newly created group',
  },
];

export const HIDDEN_LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID, FinishEventMap>[] = [
  {
    type: ObjectiveType.LEVEL_OBJECTIVE,
    id: LevelObjectiveID.AttachUserToGroup,
    finished: false,
    label: 'Give your user access to all resources in one go',
  },
];

const S3_READ_POLICY_CONTENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['s3:GetObject', 's3:ListBucket'],
        Resource: ['arn:aws:s3:::public-images', 'arn:aws:s3:::public-images/*'],
      },
    ],
  },
  null,
  2
);

const DYNAMODB_READ_POLICY_CONTENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:GetItem',
          'dynamodb:BatchGetItem',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:DescribeTable',
        ],
        Resource: 'arn:aws:dynamodb:*:*:table/prod_Users',
      },
    ],
  },
  null,
  2
);

const EC2_READ_POLICY_CONTENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['ec2:DescribeInstances', 'ec2:DescribeInstanceStatus'],
        Resource: 'arn:aws:ec2:us-west-2:123456789012:instance/i-0abcd1234efgh5678',
      },
    ],
  },
  null,
  2
);

export const INITIAL_RESOURCES_INFO: PartialWithRequired<
  IAMResourceNodeData,
  'id' | 'label' | 'image'
>[] = [
  {
    id: 's3_bucket_1',
    label: 'public-images',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: 'dynamo_table_1',
    label: 'prod_Users',
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
  {
    id: 'ec2_instance_1',
    label: 'ec2-instance',
    image: IAMNodeImage.Server,
    resource_type: IAMNodeResourceEntity.EC2Instance,
  },
];

export const INITIAL_POLICIES_INFO: PartialWithRequired<
  IAMPolicyNodeData,
  'id' | 'label' | 'granted_accesses' | 'content'
>[] = [
  {
    id: 'iam_policy_1',
    label: 's3-read-access',
    content: S3_READ_POLICY_CONTENT,
    granted_accesses: {
      [INITIAL_RESOURCES_INFO[0].id]: AccessLevel.Read,
    },
  },
  {
    id: 'iam_policy_2',
    label: 'dynamo-read-access',
    content: DYNAMODB_READ_POLICY_CONTENT,
    granted_accesses: {
      [INITIAL_RESOURCES_INFO[1].id]: AccessLevel.Read,
    },
  },
  {
    id: 'iam_policy_3',
    label: 'ec2-read-access',
    content: EC2_READ_POLICY_CONTENT,
    granted_accesses: {
      [INITIAL_RESOURCES_INFO[2].id]: AccessLevel.Read,
    },
  },
];

export const INITIAL_USERS_INFO: Pick<IAMUserNodeData, 'id' | 'label'>[] = [
  {
    id: 'iam_user_1',
    label: 'IAM User 1',
  },
];
