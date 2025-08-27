import { PermissionBoundaryID, PolicyNodeID, UserNodeID } from '../types/node-id-enums';
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
];
