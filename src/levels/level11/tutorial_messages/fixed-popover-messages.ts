import { FixedPopoverMessage } from '@/levels/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  The currently attached permission boundary to Sephiroth caps his maximum permissions
  to listing SNS topics only. **Close this popover to continue.**
`;

const FIXED_POPOVER_MSG2 = `
  Everything is in place now, well, almost.

  Let's **connect the nodes you've created**. Here's what you're going to do:

  * Connect the permission boundary to the role
  * Connect the delegation policy to the role
`;

const FIXED_POPOVER_MSG3 = `
  Nice job. To recap, here's what you've achieved so far:

  * Created a permission boundary which caps access to reading secrets
  that are tagged with the same \`team\` tag as the user making the request

  * Creating a permission policy which allows attaching polices to other roles
  but *only* to roles that have the previous permission boundary attached.

  *** Click \`Next\` to demonstrate what this means in practice. ***
`;

const FIXED_POPOVER_MSG4 = `
  Notice that although Tifa assumed a role with an extremely permissive
  admin permission, she is still bound by the permission boundary we created.


  And while we gave Cloud the ability to attach any policy he wants, he is also
  still constrained by the permission boundary since he won't be able to attach the policies
  to any role that doesn't have the permission boundary attached.

  That's the power of permission boundaries for you 🔥
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Permission Boundary Content',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'Connecting The Nodes',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: "The connections you've made",
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'The setup is complete',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
