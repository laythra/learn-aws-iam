export enum PolicyNodeID {
  S3ListBucketsPolicy = 'policy-s3-list-buckets',
  S3ReadPolicy = 'policy-s3-read',
  S3ReadWritePolicy = 'policy-s3-read-write',
  DynamoDBReadWritePolicy = 'policy-dynamodb-read-write',
  CloudFrontReadPolicy = 'policy-cloudfront-read',
}

export enum GroupNodeID {
  FrontendGroup = 'group-frontend',
  BackendGroup = 'group-backend',
}

export enum UserNodeID {
  Laith = 'user-laith',
  Ali = 'user-ali',
  Mohammad = 'user-mohammad',
  Khalid = 'user-khalid',
}

export enum ResourceNodeID {
  PublicImagesS3Bucket = 'resource-s3bucket-public-images',
  PublicAssetsS3Bucket = 'resource-s3bucket-public-assets',
  CloudFront = 'resource-cloudfront',
  DynamoDBTable = 'resource-dynamodbtable',
}
