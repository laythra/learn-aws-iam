import type { PopoverTutorialMessage, PopupTutorialMessage, LevelObjective } from '../types';
import { IAMNodeImage } from '@/types';

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

export const LEVEL_OBJECTIVES: { [key: string]: LevelObjective } = {
  create_iam_group: {
    finished: false,
    label: 'Create an IAM Group',
  },
  enable_reading_from_bucket: {
    finished: false,
    label: 'Make things easier to scale using the newly created group',
  },
};

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

export const INITIAL_RESOURCES_INFO = [
  {
    id: 's3_bucket_1',
    name: 'public-images',
    entity: 'S3 Bucket',
    image: IAMNodeImage.S3Bucket,
  },
  {
    id: 'dynamo_table_1',
    name: 'dynamo-table',
    entity: 'Dynamo Table',
    image: IAMNodeImage.Database,
  },
  {
    id: 'ec2_instance_1',
    name: 'ec2-instance',
    entity: 'EC2 Instance',
    image: IAMNodeImage.Server,
  },
];

export const INITIAL_POLICIES_INFO = [
  {
    id: 's3_read_policy_1',
    name: 's3-read-access',
    entity: 'IAM Policy',
    image: 'IAMPolicy',
    code: S3_READ_POLICY_CONTENT,
    affected_resources: INITIAL_RESOURCES_INFO[0].id,
  },
  {
    id: 'dynamo_read_policy_1',
    name: 'dynamo-read-access',
    entity: 'IAM Policy',
    image: 'IAMPolicy',
    code: DYNAMODB_READ_POLICY_CONTENT,
    affected_resources: INITIAL_RESOURCES_INFO[1].id,
  },
  {
    id: 'ec2_read_policy_1',
    name: 'ec2-read-access',
    entity: 'IAM Policy',
    image: 'IAMPolicy',
    code: EC2_READ_POLICY_CONTENT,
    affected_resources: INITIAL_RESOURCES_INFO[1].id,
  },
];
