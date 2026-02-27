import { FixedPopoverMessage } from '@/levels/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  You will see several users attached to two groups.
  Each group represents a team in your company.

  Notice that each user and resource has an **application** tag
  that represents the app they work on.
  One user is intentionally tagged differently, even though they are in the same group.

  Take a minute to explore these tags.
`;

const FIXED_POPOVER_MSG2 = `
  The objective of this level is to let users connect only to RDS instances
  for the same application they work on.

  To achieve this, we need to match the user's **application** tag
  with the **application** tag of the RDS instance.
`;

const FIXED_POPOVER_MSG3 = `
  Nice work! You're getting the hang of it!

  One thing remains: you might have noticed how similar the two policies are.
  They use almost the same actions and conditions, with only the tag value changing.

  For this reason, we can use **policy variables**,
  which are placeholders that get replaced with actual values when the policy is evaluated.
`;

const FIXED_POPOVER_MSG4 = `
  We will remove the two policies we created earlier
  and replace them with a single shared policy.

  Think about how you can use a policy variable to dynamically match
  the resource's **application** tag against the user's own **application** tag.
`;

const FIXED_POPOVER_MSG5 = `
  Notice how one policy granted the correct permissions to both groups.
  This works because we can inject dynamic values with policy variables,
  enabling us to create a single policy that works across multiple groups.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Understanding the Environment',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Objective Overview',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Utilizing Policy Variables',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Creating a Single Policy with Variables',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'One policy for both groups! 💪🏻',
    popover_content: FIXED_POPOVER_MSG5,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
