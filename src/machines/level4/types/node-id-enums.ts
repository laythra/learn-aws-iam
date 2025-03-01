export enum PolicyNodeID {
  DeveloperPolicy = 'arn:aws:iam::123456789012:policy/devloper-policy',
  DataScientistPolicy = 'arn:aws:iam::123456789012:policy/data-scientist-policy',
  InternPolicy = 'arn:aws:iam::123456789012:policy/intern-policy',
}

export enum UserNodeID {
  Developer1 = 'arn:aws:iam::123456789012:user/omar',
  Developer2 = 'arn:aws:iam::123456789012:user/sara',
  DataScientist1 = 'arn:aws:iam::123456789012:user/ahmad',
  Intern1 = 'arn:aws:iam::123456789012:user/layla',
  Intern2 = 'arn:aws:iam::123456789012:user/mohammad',
}

export enum ResourceNodeID {
  CustomerDataDynamoTable = 'arn:aws:dynamodb:us-east-1:123456789012:table/customer-data',
  AnalyticsDataDynanoTable = 'arn:aws:dynamodb:us-east-1:123456789012:table/analytics-data',
  TimeshiftAssetsS3Bucket = 'arn:aws:s3:::timeshift-assets',
}
