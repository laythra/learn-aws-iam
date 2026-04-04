export const INITIAL_TRUST_POLICIES = {
  TUTORIAL_ROLE_TRUST_POLICY1: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: 'arn:aws:iam::012345678912:user/laith' },
        Action: 'sts:AssumeRole',
      },
    ],
  },
  TUTORIAL_ROLE_TRUST_POLICY2: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: 'INSERT_IAM_USER_ARN' },
        Action: 'sts:AssumeRole',
      },
    ],
  },
};
