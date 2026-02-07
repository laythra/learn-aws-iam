import { FixedPopoverMessage } from '@/levels/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  You will see a bunch of users attached to 2 groups, each group represents a team in your company.

  Also notice that each user and resource has an **application** tag associated with them,
  which represents the application they are associated with.

  Take a minute to explore these tags.
`;

const FIXED_POPOVER_MSG2 = `
  The objective of this level is to enable users to connect to RDS instances
  which belong to the application they are working on.

  To achieve this we will need to match the **application** tag of the user
  with the **application** tag of the RDS instance.
`;

const FIXED_POPOVER_MSG3 = `
  Nice work! You're getting the hang of it!

  One last thing remains here, you might've noticed how similiar the policies we created are,
  mainly the same actions and conditions, the only difference is the resource tag.

  For this reason, we can utilize something called **Policy Variables**,
  which are placeholders that get replaced with actual values when the policy is evaluated.
`;

const FIXED_POPOVER_MSG4 = `
  We will erase the two policies we created earlier,
  and create a single policy that uses a policy variable to match the resource tag.

  The variable we will use is: *\`aws:ResourceTag/application\`*,
  which tells the policy to match the **application** tag of the resource
  with the **application** tag of the user.
`;

const FIXED_POPOVER_MSG5 = `
  Notice how the same policy granted the appropriate permissions to both groups?
  This is possible because we can inject condition values as variables into the policy,
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
