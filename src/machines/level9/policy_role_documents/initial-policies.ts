export const INITIAL_POLICIES = {
  SEPARATE_RDS_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['INSERT_ACTION_HERE'],
        Resource: '*',
        Condition: {},
      },
      {
        Effect: 'Allow',
        Action: ['rds-db:connect'],
        Resource: ['arn:aws:rds-db:*:*:dbuser:*/*'],
        Condition: {},
      },
    ],
  },
  SHARED_RDS_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['rds:DescribeDBInstances'],
        Resource: '*',
        Condition: {
          StringEquals: {
            'aws:ResourceTag/application': '',
          },
        },
      },
      {
        Effect: 'Allow',
        Action: ['rds-db:connect'],
        Resource: ['arn:aws:rds-db:*:*:dbuser:*/*'],
        Condition: {
          StringEquals: {
            'aws:ResourceTag/application': '',
          },
        },
      },
    ],
  },
};
