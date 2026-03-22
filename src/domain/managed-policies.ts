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
