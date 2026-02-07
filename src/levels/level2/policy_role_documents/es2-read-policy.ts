export const EC2_READ_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['ec2:DescribeInstances', 'ec2:DescribeInstanceStatus'],
        Resource: 'arn:aws:ec2:us-west-2:123456789012:instance/i-0abcd1234efgh5678',
      },
    ],
  },
  null,
  2
);
