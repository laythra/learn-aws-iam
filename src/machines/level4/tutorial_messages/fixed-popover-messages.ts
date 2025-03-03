import { FixedPopoverMessage } from '@/machines/types';

const FIXED_POPOVER_MSG1 = `
***TimeShift Labs*** has recently discovered that some users have access to data and services
beyond what is necessary for their roles. This over-permission is not immediately obvious and stems
from subtle misconfigurations in their **IAM policies**
`;

const FIXED_POPOVER_MSG2 = `
  Luckily, *TimeShift Labs* has a very simple technical hierarchy:|lg

  * **Developers** - Who should only have read access (GetItem)
      to the \`AnalyticsData\` table inside **DynamoDB** and no access to \`CustomerData\` table.

  * **Data Scientists** - Who should be able to ***read/write*** objects
      from/to the \`timeshift-assets\` **S3 Bucket** and **read/write**
      objects from/to the \`AnalyticsData\` table inside **DynamoDB**.

  * **Interns** - Who should be able to read objects from the \`timeshift-assets\` **S3 Bucket**.

  Your role comes here to **Edit** the **IAM policies**
   to ensure that the above hierarchy is enforced.
`;

const FIXED_POPOVER_MSG3 = `
You will presented with *TimeShift Labs*' current IAM setup, which includes their current:
**IAM Users**, **IAM Resources**, and **IAM Policies**

You are tasked with the following points:
* Ensure no user has more permissions to their designated resources than necessary.
* Ensure no user has missing permissions to their designated resources.


**Edit** the **IAM policies** to ensure that the above hierarchy is enforced.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Your Task as an IAM specialist',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Your Task as an IAM specialist',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'ARNs',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
