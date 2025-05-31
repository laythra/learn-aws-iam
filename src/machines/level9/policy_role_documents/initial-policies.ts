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
  TUTORIAL_SECRETS_READ_PERMISSION_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue'],
        Resource: '*',
      },
    ],
  },
  IN_LEVEL_INITIAL_SCP: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'INSERT_EFFECT_HERE',
        Action: 'SecretsManager:GetSecretValue',
        Resource: '*',
        Condition: 'INSERT_CONDITION_HERE',
      },
    ],
  },
};
