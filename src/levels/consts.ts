import { IAMCodeDefinedEntities } from '@/config/consts';
import { createHorizontalGroup, createVerticalGroup } from '@/domain/layout-group-factory';
import { LAYOUT_DIRECTIONS } from '@/features/canvas/utils/node-position-geometry';
import { CommonLayoutGroupID, IAMNodeEntity } from '@/types/iam-enums';
import { VALID_INITIAL_POSITIONS } from '@/types/iam-layout-types';

export const MANAGED_POLICIES = {
  AWSS3ReadOnlyAccess: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['s3:Get*', 's3:List*'],
        Resource: '*',
      },
    ],
  },
  EmptyPolicy: {
    Version: '2012-10-17',
    Statement: [],
  },
  EmptyPolicyWithCondition: {
    Version: '2012-10-17',
    Statement: [],
    Condition: {},
  },
  EmptyTrustPolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '...',
        Action: 'sts:AssumeRole',
      },
    ],
  },
  EmptyPermissionPolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [],
        Resource: [],
      },
    ],
  },
  FullAccessPolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: '*',
        Resource: '*',
      },
    ],
  },
};

export const TUTORIAL_FINISHED_POPUP_MESSAGE = `
🎉 **Well done!** You’ve completed the **IAM Tutorial Demo**.

You’ve learned the basics of IAM — how **users**, **groups**, **roles**, and **policies**
work together to manage access to AWS resources securely and effectively.

&nbsp;

🚀 **Coming soon:** We’ll dive deeper into advanced IAM concepts like:|weight(700)

* 🔒 *Permission Boundaries*

* 🏢 *Service Control Policies (SCPs)*

* 🌐 *Federated Access*
...and more!

&nbsp;

📚 In the meantime, check out these resources to keep leveling up:|weight(700)

* IAM Best Practices – AWS Docs

* IAM Policy Generator

&nbsp;

🔁 Want to start over? Click the button below to replay the
tutorial from the beginning and sharpen your skills again.|weight(700)
`;

export const DEFAULT_ROLE_POLICY_OBJECTIVES_MAP = IAMCodeDefinedEntities.reduce(
  (acc, entity) => {
    acc[entity] = { objectives: [], current_index: 0 };
    return acc;
  },
  {} as Record<IAMNodeEntity, { objectives: []; current_index: number }>
);

export const COMMON_LAYOUT_GROUPS = VALID_INITIAL_POSITIONS.flatMap(position =>
  LAYOUT_DIRECTIONS.map(direction => {
    const key = `${position}-${direction}` as CommonLayoutGroupID;
    return direction === 'vertical'
      ? createVerticalGroup(key, position)
      : createHorizontalGroup(key, position);
  })
);
