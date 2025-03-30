import { uniqueId } from 'lodash';

export const PolicyNodeID = {
  S3ReadPolicy: uniqueId('policy-'),
  S3ReadWritePolicy: uniqueId('policy-'),
  DynamoDBReadWritePolicy: uniqueId('policy-'),
  CloudFrontReadPolicy: uniqueId('policy-'),
} as const;

export const GroupNodeID = {
  FrontendGroup: uniqueId('group-'),
  BackendGroup: uniqueId('group-'),
} as const;

export const UserNodeID = {
  Laith: uniqueId('user-'),
  Ali: uniqueId('user-'),
  Mohammad: uniqueId('user-'),
  Khalid: uniqueId('user-'),
} as const;

export const ResourceNodeID = {
  PublicImagesS3Bucket: uniqueId('resource-s3bucket-'),
  CloudFront: uniqueId('resource-cloudfront-'),
  DynamoDBTable: uniqueId('resource-dynamodbtable-'),
} as const;
