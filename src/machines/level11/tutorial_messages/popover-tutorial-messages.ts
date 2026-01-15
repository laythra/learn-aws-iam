import { PermissionBoundaryID, PolicyNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Permission boundaries are policies that **cap** the max permissions
  a user or role can ever get.

  **Open Sephiroth’s boundary to see it.**
`;

const POPOVER_MSG2 = `
  This policy grants full S3 access.
  Try attaching it to Sephiroth.
`;

const POPOVER_MSG3 = `
  Even with full S3 access attached, Sephiroth still can’t read the bucket.
  The permission boundary caps him to listing SNS topics only.
`;

const POPOVER_MSG4 = `
  **Cloud** is the senior developer (see the \`level\` tag).
  He’ll delegate secret-read access to the team via a boundary.
`;

const POPOVER_MSG5 = `
  We need a permission boundary that limits Cloud’s delegation abilities,
  and lets him attach policies only to roles that use that boundary.
`;

const POPOVER_MSG6 = `
  This is the delegation role Cloud will use.
  Feel free to inspect its trust policy with :icon[CodeBracketIcon]:.
`;

const POPOVER_MSG7 = ``;

const POPOVER_MSG8 = `
  Nailed it. Now create a permission policy for delegation.
`;

const POPOVER_MSG9 = ``;

const POPOVER_MSG10 = `
  Almost done! Now watch what happens when Cloud attaches the admin policy
  and a user assumes the role.

  Next, we’ll view it from Cloud’s POV.

`;

const POPOVER_MSG11 = `
  Cloud attached the admin policy to the role.

  Next, we’ll see it from Tifa’s POV.
`;

const POPOVER_MSG12 = `
  Tifa is a junior dev (see the \`level\` tag). She’s about to assume the role.

  **The role allows anyone with \`level: junior\` to assume it.** 😉
`;

const POPOVER_MSG13 = `
  Tifa can assume the role.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: PermissionBoundaryID.PermissionBoundary1,
    popover_title: 'The power of permission boundaries',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: PolicyNodeID.Policy1,
    popover_title: 'Attach a policy to Sephiroth',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'right',
  },
  {
    element_id: UserNodeID.Sephiroth,
    popover_title: 'Sephiroth cannot read the archives',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: UserNodeID.Cloud,
    popover_title: 'Meet Cloud, the senior developer',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.Cloud,
    popover_title: 'Delegating permissions',
    popover_content: POPOVER_MSG5,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: RoleNodeID.Role1,
    popover_title: 'Delegation role',
    popover_content: POPOVER_MSG6,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create your first permission boundary',
    popover_content: POPOVER_MSG7,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: PermissionBoundaryID.SecretsReadingPermissionBoundary,
    popover_title: 'Nailed it',
    popover_content: POPOVER_MSG8,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create the delegation policy',
    popover_content: POPOVER_MSG9,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: UserNodeID.Cloud,
    popover_title: 'Delegating access',
    popover_content: POPOVER_MSG10,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: PolicyNodeID.FullAccessPolicy,
    popover_title: 'Attaching the admin policy',
    popover_content: POPOVER_MSG11,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: UserNodeID.Tifa,
    popover_title: 'Assuming the role as Tifa',
    popover_content: POPOVER_MSG12,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: UserNodeID.Tifa,
    popover_title: 'Assume the role',
    popover_content: POPOVER_MSG13,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'left',
  },
];
