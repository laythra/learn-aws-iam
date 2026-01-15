import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
**TimeShift Labs** noticed some users have *more* access than they need.
It’s not obvious at first—it comes from subtle policy misconfigurations.
`;

const FIXED_POPOVER_MSG2 = `
  *TimeShift Labs* keeps it simple:

  * **Developers** should only **read** (GetItem) from the \`AnalyticsData\` table,
    and have **no access** to \`CustomerData\`.

  * **Data Scientists** need **read/write** on the \`timeshift-assets\` **S3 bucket**
    and **read/write** on the \`AnalyticsData\` **DynamoDB** table.

  * **Interns** should only **read** from the \`timeshift-assets\` bucket.

  Your job: **edit** the policies to enforce this setup.
`;

const FIXED_POPOVER_MSG3 = `
You’ll see their current **IAM Users**, **Resources**, and **Policies**.

Your checklist:
* No user has extra permissions.
* No user is missing required permissions.

Then edit the policies until the hierarchy is correct.
`;

const FIXED_POPOVER_MSG4 = `
  To edit a policy, click the :icon[PencilSquareIcon]: in the
  top-right of the policy content view.
`;

const FIXED_POPOVER_MSG5 = `
  Permissions are sorted! Everyone now has the right access.
  You’re basically a policy wizard at this point. 🔥
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: "TimeShift Labs' current situation",
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: "TimeShift Labs' technical hierarchy",
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Your task as an IAM specialist',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Editing IAM policies',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
    tutorial_gif: 'node-content-editing',
  },
  {
    popover_title: 'Permissions sorted 🔥',
    popover_content: FIXED_POPOVER_MSG5,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
