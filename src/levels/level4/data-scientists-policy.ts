export const DATA_SCIENTISTS_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:Scan',
          'dynamodb:Query',
        ],
        Resource: '*',
      },
    ],
  },
  null,
  2
);
