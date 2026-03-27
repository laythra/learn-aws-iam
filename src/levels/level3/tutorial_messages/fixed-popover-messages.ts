import { FixedPopoverMessage } from '@/types/tutorial-message-types';

const POPOVER_MSG1 = `
  What you're seeing is the **Policy's** statement —
  the core of the policy, represented in JSON format.

  ***Close the policy statement by clicking the top-right close icon.***
`;

const POPOVER_MSG2 = `
  In addition to the **Policy's** content, you can also view its **ARN** by clicking
  the \`::icon[IdentificationIcon]::\` icon next to the content button
`;

const POPOVER_MSG3 = `
  ::badge[RULE]::
  What's an **ARN**?
  An **ARN** (Amazon Resource Name) is a unique identifier used to
  distinguish an AWS resource across the entire AWS ecosystem.

  e.g. \`arn:aws:iam::123456789012:policy/my-policy\`

  ARNs aren't exclusive to **IAM** -
  they're an AWS-wide concept used to identify and reference any resource.
`;

const POPOVER_MSG4 = `
  An **S3 Bucket** resource is now visible.
  Copy the **Bucket's ARN** by clicking the **id** icon \`::icon[IdentificationIcon]::\`
  and then the copy \`::icon[ClipboardDocumentIcon]::\` icon next to the ARN.
`;

const POPOVER_MSG5 = `
  You nailed it! Developers from both departments
  now have their permissions properly configured 🫡
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'The Policy Statement',
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
    tutorial_video: 'arn',
  },
  {
    popover_title: 'Access Granted 🔥',
    popover_content: POPOVER_MSG5,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
