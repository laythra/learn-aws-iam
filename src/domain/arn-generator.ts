import { IAMNodeEntity, IAMNodeResourceEntity } from '@/types/iam-enums';

type ArnGenerator = (resourceName: string, accountId: string, region?: string) => string;

function generateSuffix(seed: string, length: number): string {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }

  return (hash >>> 0).toString(36).padStart(length, '0').slice(0, length);
}

const arnStrategies: Record<string, ArnGenerator> = {
  [IAMNodeEntity.User]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:user/${resourceName}`,
  [IAMNodeEntity.Role]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:role/${resourceName}`,
  [IAMNodeEntity.IdentityPolicy]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:policy/${resourceName}`,
  [IAMNodeEntity.Group]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:group/${resourceName}`,
  [IAMNodeEntity.SCP]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:policy/${resourceName}`,
  [IAMNodeEntity.PermissionBoundary]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:policy/${resourceName}`,
  [IAMNodeResourceEntity.S3Bucket]: resourceName => `arn:aws:s3:::${resourceName}`,
  [IAMNodeResourceEntity.Lambda]: (resourceName, accountId, region = 'us-east-1') =>
    `arn:aws:lambda:${region}:${accountId}:function:${resourceName}`,
  [IAMNodeResourceEntity.EC2Instance]: (resourceName, accountId, region = 'us-east-1') =>
    `arn:aws:ec2:${region}:${accountId}:instance/${resourceName}`,
  [IAMNodeResourceEntity.DynamoDBTable]: (resourceName, accountId, region = 'us-east-1') =>
    `arn:aws:dynamodb:${region}:${accountId}:table/${resourceName}`,
  [IAMNodeResourceEntity.CloudFront]: (resourceName, accountId) =>
    `arn:aws:cloudfront::${accountId}:distribution/${resourceName}`,
  [IAMNodeResourceEntity.Billing]: (resourceName, accountId) =>
    `arn:aws:budgets::${accountId}:budget/${resourceName}`,
  [IAMNodeResourceEntity.Secret]: (resourceName, accountId, region = 'us-east-1') => {
    const suffix = generateSuffix(resourceName, 6);
    return `arn:aws:secretsmanager:${region}:${accountId}:secret:${resourceName}-${suffix}`;
  },
  [IAMNodeResourceEntity.RDS]: (resourceName, accountId, region = 'us-east-1') =>
    `arn:aws:rds:${region}:${accountId}:db:${resourceName}`,
  [IAMNodeResourceEntity.CodeDeploy]: (resourceName, accountId, region = 'us-east-1') =>
    `arn:aws:codedeploy:${region}:${accountId}:application:${resourceName}`,
  [IAMNodeResourceEntity.ElastiCache]: (resourceName, accountId, region = 'us-east-1') =>
    `arn:aws:elasticache:${region}:${accountId}:cluster:${resourceName}`,
};

export const SupportedArnNodeTypes = Object.keys(arnStrategies);
export function generateArn(
  serviceType: IAMNodeEntity | IAMNodeResourceEntity,
  resourceName: string,
  accountId: string = '123456789012',
  region: string = 'us-east-1'
): string {
  const strategy = arnStrategies[serviceType];
  if (!strategy) {
    throw new Error(`Unsupported service type: ${serviceType}`);
  }

  return strategy(resourceName, accountId, region);
}
