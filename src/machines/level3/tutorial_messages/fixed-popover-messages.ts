import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  You’re looking at the policy **Statement**—the JSON brain of a policy.

  ***Close it by clicking the top-right close icon.***
`;

const POPOVER_MSG2 = `
  You can also view the policy **ARN** by clicking the :icon[IdentificationIcon]: icon to the
  left of the content icon.
`;

const POPOVER_MSG3 = `
  ::badge[Info]:: an **ARN** is a unique identifier for AWS resources.

  Example:



  \`arn:aws:iam::123456789012:policy/my-policy\`

  It’s used across AWS, not just IAM.
`;

const POPOVER_MSG4 = `
  Here’s an **S3 Bucket**.
  Copy its ARN by clicking :icon[IdentificationIcon]:, then hit the
  copy :icon[ClipboardDocumentIcon]: icon next to the ARN.
`;

const POPOVER_MSG5 = `
  You nailed it! Both teams have the right access now 🫡
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'The policy statement',
    popover_content: POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'ARNs',
    popover_content: POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'ARNs',
    popover_content: POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'ARNs',
    popover_content: POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
    tutorial_gif: 'arn',
  },
  {
    popover_title: 'Access granted 🔥',
    popover_content: POPOVER_MSG5,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
