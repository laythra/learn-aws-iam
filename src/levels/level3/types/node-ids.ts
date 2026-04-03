export enum PolicyNodeID {
  S3ListBucketsPolicy = 'policy-s3-list-buckets',
  S3ReadPolicy = 'policy-s3-read',
  S3ReadWritePolicy = 'policy-s3-read-write',
  DynamoDBReadWritePolicy = 'policy-dynamodb-read-write',
  CloudFrontInvalidationPolicy = 'policy-cloudfront-invalidation',
}

export enum GroupNodeID {
  FrontendGroup = 'group-frontend',
  BackendGroup = 'group-backend',
}

export enum UserNodeID {
  Alex = 'user-alex',
  Sam = 'user-sam',
  Morgan = 'user-morgan',
  Jordan = 'user-jordan',
}

export enum ResourceNodeID {
  PublicImagesS3Bucket = 'resource-s3bucket-public-images',
  PublicAssetsS3Bucket = 'resource-s3bucket-public-assets',
  CloudFront = 'resource-cloudfront',
  DynamoDBTable = 'resource-dynamodbtable',
}
