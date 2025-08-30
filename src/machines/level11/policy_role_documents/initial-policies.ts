export const INITIAL_POLICIES = {
  SNS_READ_ONLY_BOUNDARY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'sns:ListTopics',
        Resource: '*',
      },
    ],
  },
  S3_READ_ONLY_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 's3:Get*',
        Resource: '*',
      },
    ],
  },
  DELEGATE_PERMISSIONS_ROLE: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: '*' },
        Action: 'sts:AssumeRole',
        Condition: {
          StringEquals: {
            'aws:PrincipalTag/Level': 'senior',
          },
        },
      },
    ],
  },
  READ_SECRETS_PERMISSION_BOUNDARY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [],
        Resource: '*',
        Condition: {},
      },
    ],
  },
};
