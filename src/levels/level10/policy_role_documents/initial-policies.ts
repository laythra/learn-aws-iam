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
      {
        Effect: 'Allow',
        Action: 'ec2:RunInstances',
        Resource: [
          'arn:aws:ec2:*:*:subnet/*',
          'arn:aws:ec2:*:*:network-interface/*',
          'arn:aws:ec2:*:*:security-group/*',
          'arn:aws:ec2:*:*:volume/*',
          'arn:aws:ec2:*::image/*',
        ],
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
