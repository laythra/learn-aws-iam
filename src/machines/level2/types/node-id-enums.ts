export const UserNodeID = {
  FirstUser: 'user-1',
  SecondUser: 'user-2',
} as const;

export const GroupNodeID = {
  FirstGroup: 'group-1',
} as const;

export const ResourceNodeID = {
  S3Bucket: 'resource-s3bucket-1',
  DynamoDBTable: 'resource-dynamodbtable-1',
  EC2Instance: 'ec2-instance-1',
} as const;

export const PolicyNodeID = {
  PolicyNode1: 'policy-1',
  PolicyNode2: 'policy-2',
  PolicyNode3: 'policy-3',
} as const;
