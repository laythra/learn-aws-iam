export enum PolicyNodeID {
  S3ReadAccess = 'S3_read_access',
  S3ReadWriteAcces = 'S3_read_write_access',
  DynamoDBReadWriteAccess = 'DynamoDB_read_write_access',
  CloudfrontReadAccess = 'Cloudfront_read_access',
}

export enum GroupNodeID {
  FrontendGroup = 'iam_group_1',
  BackendGroup = 'iam_group_2',
}

export enum UserNodeID {
  User1 = 'Laith',
  User2 = 'Ali',
  User3 = 'Mohammed',
  User4 = 'Khalid',
}

export enum ResourceNodeID {
  S3Bucket = 'iam_resource_1',
  CloudFront = 'iam_resource_2',
  DynamoDBTable = 'iam_resource_3',
}
