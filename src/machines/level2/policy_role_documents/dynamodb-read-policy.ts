export const DYNAMO_DB_READ_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:GetItem',
          'dynamodb:BatchGetItem',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:DescribeTable',
        ],
        Resource: 'arn:aws:dynamodb:*:*:table/prod_Users',
      },
    ],
  },
  null,
  2
);
