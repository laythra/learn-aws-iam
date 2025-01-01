export enum UserNodeID {
  FinanceUser = 'FinanceUser',
}

export enum ResourceNodeID {
  BillingAndCostManagement = 'BillingAndCostManagement',
  FinanceS3Bucket = 'FinanceS3Bucket',
  LambdaFunction = 'LambdaFunction',
  UsersCertificatesS3Bucket = 'UsersCertificatesS3Bucket',
  TimeshiftLabsEC2Instance = 'TimeshfitLabsEC2Instance',
}

export enum RoleNodeID {
  FinanceAuditorRole = 'FinanceAuditorRole',
  S3ReadAccessRole = 'S3ReadAccessRole',
  EC2Role = 'EC2Role',
  LambdaRole = 'LambdaRole',
}

export enum PolicyNodeID {
  BillingPolicy = 'BillingPolicy',
  S3ReadPolicy = 'S3ReadPolicy',
  UsersCertificatesS3WritePolicy = 'UsersCertificatesS3WritePolicy',
  UsersCertificatesS3ReadPolicy = 'UsersCertificatesS3ReadPolicy',
}
