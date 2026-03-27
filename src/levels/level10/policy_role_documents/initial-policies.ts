export const INITIAL_POLICIES = {
  POLICY_WITH_CONDITION: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: '...',
        Resource: '*',
        Condition: '...',
      },
      {
        Effect: 'Allow',
        Action: '...',
        Resource: '*',
        Condition: '...',
      },
    ],
  },
  EC2_MANAGEMENT_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['....'],
        Resource: '*',
        Condition: {
          StringEquals: {},
        },
      },
    ],
  },
};
