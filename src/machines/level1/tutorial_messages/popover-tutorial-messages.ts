import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import type { PopoverTutorialMessage } from '@/machines/types';
import { PopoverElementID } from '@/theme';
import { getEdgeName } from '@/utils/names';

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ResourceNodeID.PublicImagesS3Bucket,
    popover_title: 'S3 Bucket',
    popover_content: `This S3 bucket represents an AWS resource that you can control access to`,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.S3ReadPolicy,
    popover_title: 'IAM Policies',
    popover_content: `
      This IAM policy is a document that defines actions that can performed on AWS resources
      (The S3 Bucket you've just seen for example)`,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PopoverElementID.NewEntityBtn,
    popover_title: 'IAM users',
    popover_content: `Let's begin by creating your IAM user`,
    show_next_button: false,
    show_close_button: false,
  },
  {
    element_id: PopoverElementID.IAMIdentityNameInput,
    popover_title: `Let's put your name here, shall we?`,
    popover_content: ``,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: `Tada! 🎉`,
    popover_content: `
      You've successfully created your IAM user!
      Drag your IAM user around a little bit
    `,
    show_next_button: true,
    show_close_button: false,
  },
  {
    element_id: PolicyNodeID.S3ReadPolicy,
    popover_title: `Attacing Policies`,
    popover_content: `
      Try attaching the AWS managed policy to your IAM user
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.PublicImagesS3Bucket,
    popover_title: `Access Granted! 🎉`,
    popover_content: `
      Your IAM user now has access to the S3 bucket
      and pretty much any other AWS resource you can think of.
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: getEdgeName(PolicyNodeID.S3ReadPolicy, ResourceNodeID.PublicImagesS3Bucket),
    popover_title: `Hover over the edge`,
    popover_content: `
      You can see the access level and the resource that the policy grants access to
      by hovering over the edge connecting the policy and the resource
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'left',
  },
];
