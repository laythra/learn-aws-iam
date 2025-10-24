import { uniqueId } from 'lodash';

export const PolicyNodeID = {
  DeveloperPolicy: 'policy-1',
  DataScientistPolicy: 'policy-2',
  InternPolicy: 'policy-3',
} as const;

export const UserNodeID = {
  Developer1: 'user-1',
  Developer2: 'user-2',
  DataScientist1: 'user-3',
  Intern1: 'user-4',
  Intern2: 'user-5',
} as const;

export const ResourceNodeID = {
  CustomerDataDynamoTable: uniqueId('resource-dynamodb-'),
  AnalyticsDataDynamoTable: uniqueId('resource-dynamodb-'),
  TimeshiftAssetsS3Bucket: uniqueId('resource-s3bucket-'),
} as const;
