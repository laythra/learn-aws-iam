import { uniqueId } from 'lodash';

export const UserNodeID = {
  FirstUser: uniqueId('user-'),
  SecondUser: uniqueId('user-'),
} as const;

export const GroupNodeID = {
  FirstGroup: uniqueId('group-'),
} as const;

export const ResourceNodeID = {
  S3Bucket: uniqueId('resource-s3bucket-'),
  DynamoDBTable: uniqueId('resource-dynamodbtable-'),
  EC2Instance: uniqueId('resource-ec2instance-'),
} as const;

export const PolicyNodeID = {
  PolicyNode1: uniqueId('policy-'),
  PolicyNode2: uniqueId('policy-'),
  PolicyNode3: uniqueId('policy-'),
} as const;
