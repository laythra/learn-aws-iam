export const INITIAL_POLICIES = {
  S3_WRITE_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['s3:PutObject'],
        Resource: 'arn:aws:s3:::chat-images/*',
      },
    ],
  },
  S3_READ_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['s3:GetObject'],
        Resource: 'arn:aws:s3:::chat-images/*',
      },
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: 'arn:aws:s3:::chat-images',
      },
    ],
  },
};
