export enum UserNodeID {
  FinanceUser = 'arn:aws:iam::123456789012:user/FinanceUser',
}

export enum ResourceNodeID {
  BillingAndCostManagement = 'arn:aws:iam::aws:policy/BillingAndCostManagement',
  FinanceS3Bucket = 'arn:aws:s3:::FinanceS3Bucket',
  LambdaFunction = 'arn:aws:lambda:us-east-1:123456789012:function:LambdaFunction',
  UsersCertificatesS3Bucket = 'arn:aws:s3:::UsersCertificatesS3Bucket',
  TimeshiftLabsEC2Instance = 'arn:aws:ec2:us-east-1:123456789012:instance/TimeshiftLabsEC2Instance',
}

export enum RoleNodeID {
  FinanceAuditorRole = 'arn:aws:iam::123456789012:role/FinanceAuditorRole',
  S3ReadAccessRole = 'arn:aws:iam::123456789012:role/S3ReadAccessRole',
  EC2Role = 'arn:aws:iam::123456789012:role/EC2Role',
  LambdaRole = 'arn:aws:iam::123456789012:role/LambdaRole',
}

export enum PolicyNodeID {
  BillingPolicy = 'arn:aws:iam::123456789012:policy/BillingPolicy',
  S3ReadPolicy = 'arn:aws:iam::123456789012:policy/S3ReadPolicy',
  UsersCertificatesS3WritePolicy = 'arn:aws:iam::123456789012:policy/UsersCertificatesS3WritePolicy',
  UsersCertificatesS3ReadPolicy = 'arn:aws:iam::123456789012:policy/UsersCertificatesS3ReadPolicy',
}
