import { IAMNodeEntity, IAMNodeResourceEntity } from '@/types';

type ArnGenerator = (resourceName: string, accountId: string, region?: string) => string;

const arnStrategies: Record<string, ArnGenerator> = {
  [IAMNodeEntity.User]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:user/${resourceName}`,
  [IAMNodeEntity.Role]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:role/${resourceName}`,
  [IAMNodeEntity.Policy]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:policy/${resourceName}`,
  [IAMNodeEntity.Group]: (resourceName, accountId) =>
    `arn:aws:iam::${accountId}:group/${resourceName}`,
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
