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
};
