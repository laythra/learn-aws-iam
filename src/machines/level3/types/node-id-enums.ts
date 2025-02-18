export enum PolicyNodeID {
  S3ReadAccess = 'arn:aws:iam::123456789012:policy/S3_read_access',
  S3ReadWriteAcces = 'arn:aws:iam::123456789012:policy/S3_read_write_access',
  DynamoDBReadWriteAccess = 'arn:aws:iam::123456789012:policy/DynamoDB_read_write_access',
  CloudfrontReadAccess = 'arn:aws:iam::123456789012:policy/Cloudfront_read_access',
}

export enum GroupNodeID {
  FrontendGroup = 'arn:aws:iam::123456789012:group/frontend_group',
  BackendGroup = 'arn:aws:iam::123456789012:group/backend_group',
}

export enum UserNodeID {
  Laith = 'arn:aws:iam::123456789012:user/Laith',
  Ali = 'arn:aws:iam::123456789012:user/Ali',
  Mohammad = 'arn:aws:iam::123456789012:user/Mohammad',
  Khalid = 'arn:aws:iam::123456789012:user/Khalid',
}

export enum ResourceNodeID {
  PublicImagesS3Bucket = 'arn:aws:s3:::public-assets',
  CloudFront = 'arn:aws:cloudfront::123456789012:distribution/E1A2B3C4D5E6F7',
  DynamoDBTable = 'arn:aws:dynamodb:us-east-1:123456789012:table/user-profiles',
}
