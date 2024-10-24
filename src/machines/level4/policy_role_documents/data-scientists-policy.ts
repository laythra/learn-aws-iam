export const DATA_SCIENTISTS_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'dynamodb:*Item',
        Resource: '*',
      },
    ],
  },
  null,
  2
);
