import { LevelObjectiveID } from './types/objective-enums';
import type { PopoverTutorialMessage, PopupTutorialMessage, LevelObjective } from '../types';

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: 'iam_resource_1',
    popover_title: 'S3 Bucket',
    popover_content: `This S3 bucket represents an AWS resource that you can control access to`,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: 'iam_policy_1',
    popover_title: 'IAM Policies',
    popover_content: `
      This IAM policy is a document that defines actions that can performed on AWS resources
      (The S3 Bucket you've just seen for example)`,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: 'new_entity_btn',
    popover_title: 'IAM users',
    popover_content: `Let's begin by creating your IAM user`,
    show_next_button: false,
    show_close_button: false,
  },
  {
    element_id: 'iam_identity_name',
    popover_title: `Let's put your name here, shall we?`,
    popover_content: ``,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: 'iam_user_1',
    popover_title: `Tada! 🎉`,
    popover_content: `
      You've successfully created your IAM user!
      Drag your IAM user around a little bit
    `,
    show_next_button: true,
    show_close_button: false,
  },
  {
    element_id: 'iam_policy_1',
    popover_title: `Attacing Policies`,
    popover_content: `
      Try attaching the AWS managed policy to your IAM user
    `,
    show_next_button: true,
    show_close_button: false,
  },
  {
    element_id: 'iam_resource_1',
    popover_title: `Access Granted!`,
    popover_content: `
      Your IAM user now has access to the S3 bucket
      and pretty much any other AWS resource you can think of
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'IAM Project',
    content: `This is a project that will guide you through the basics of IAM`,
  },
];

export const POLICY_CONTENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [{ Effect: 'Allow', Action: '*', Resource: '*' }],
  },
  null,
  2
);

export const LEVEL_OBJECTIVES: LevelObjective<LevelObjectiveID>[] = [
  {
    finished: false,
    id: LevelObjectiveID.CreateIAMUser,
    label: 'Create an IAM user',
  },
  {
    finished: false,
    id: LevelObjectiveID.GrantIAMUserReadAccessToS3Bucket,
    label: 'Grant IAM user read access to S3 bucket',
  },
];
