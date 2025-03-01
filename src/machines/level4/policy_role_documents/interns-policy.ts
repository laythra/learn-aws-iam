export const INTERNS_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Deny',
        Action: '*',
        Resource: '*',
        Condition: {
          Bool: {
            'aws:MultiFactorAuthPresent': 'false',
          },
        },
      },
      {
        Effect: 'Allow',
        Action: ['s3:GetObject'],
        Resource: 'arn:aws:s3:::timeshift-assets/*',
      },
    ],
  },
  null,
  2
);
