import { uniqueId } from 'lodash';

export const PolicyNodeID = {
  DeveloperPolicy: uniqueId('policy-'),
  DataScientistPolicy: uniqueId('policy-'),
  InternPolicy: uniqueId('policy-'),
} as const;

export const UserNodeID = {
  Developer1: uniqueId('user-'),
  Developer2: uniqueId('user-'),
  DataScientist1: uniqueId('user-'),
  Intern1: uniqueId('user-'),
  Intern2: uniqueId('user-'),
} as const;

export const ResourceNodeID = {
  CustomerDataDynamoTable: uniqueId('resource-dynamodb-'),
  AnalyticsDataDynamoTable: uniqueId('resource-dynamodb-'),
  TimeshiftAssetsS3Bucket: uniqueId('resource-s3bucket-'),
} as const;
