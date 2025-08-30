import { PermissionBoundaryID, PolicyNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  Permission boundaries are merely policy documents that cap the maximum permissions
  that can be granted to a user or role.

  **View the attached permission boundary to Sephiroth**
`;

const POPOVER_MSG2 = `
  The following policy grants full access to all S3 buckets,
  **try attaching it to Sephiroth.**
`;

const POPOVER_MSG3 = `
  Despite granting a full S3 read policy to Sephiroth,
  he is still unable to access the S3 bucket.
  Because a permission boundary is attached to him,
  which caps the maximum permissions he can have to listing SNS topics only.
`;

const POPOVER_MSG4 = `
  **Cloud** is the senior developer (see the \`level\` tag).
  He'll delegate read secrets permissions to his team, enforced by a permission boundary.
`;

const POPOVER_MSG5 = `
  We will need to create a permission boundary to limit cloud's delegation abilities
  and also allow him to attach policies to roles
  which have the created permission boundary attached.
`;

const POPOVER_MSG6 = `
  This is the role which Cloud will use to delegate permissions to his team.
  Feel free to inspect its trust policy.
`;

const POPOVER_MSG7 = ``;
const POPOVER_MSG8 = `
  Nailed it. Let's create a permission policy which will allow us to delegate permissions.
`;

const POPOVER_MSG9 = ``;
const POPOVER_MSG10 = `
  Almost done! Now, let's see what happens when Cloud tries
  to attach the admin policy to the role and a user assumes it.

  Next, we'll what happens from Cloud's POV.

`;

const POPOVER_MSG11 = `
  Cloud has attached the admin policy to the role.

  Next, we'll see what happens from Tifa's POV.
`;

const POPOVER_MSG12 = `
  Tifa is a junior developer (see the \`level\` tag), and she will now attempt to assume the role

  ***The principal in the role allows anyone with a \`level: junior\` tag to assume it.*** 😉
`;

const POPOVER_MSG13 = `
  Tifa is allowed to assume the role.
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
    popover_title: 'Sephiroth is unable to read the planet healing archives',
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
    popover_title: 'Delegation Role',
    popover_content: POPOVER_MSG6,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create Your First Permission Boundary',
    popover_content: POPOVER_MSG7,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: PermissionBoundaryID.SecretsReadingPermissionBoundary,
    popover_title: 'Nailed it ',
    popover_content: POPOVER_MSG8,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'We need to create the permission for delegating access now',
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
