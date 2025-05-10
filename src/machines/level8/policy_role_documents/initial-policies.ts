export const INITIAL_POLICIES = {
  TUTORIAL_SCP: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [],
        Resource: '*',
      },
    ],
  },
  TUTORIA_SECRETS_READ_PERMISSION_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue'],
        Resource: '*',
      },
    ],
  },
};
