import { describe, expect, it } from 'vitest';

import { generateArn } from '@/domain/arn-generator';
import { IAMNodeEntity, IAMNodeResourceEntity } from '@/types/iam-enums';

describe('generateArn', () => {
  it('generates IAM User ARN', () => {
    const arn = generateArn(IAMNodeEntity.User, 'alice', '111122223333');
    expect(arn).toBe('arn:aws:iam::111122223333:user/alice');
  });

  it('generates IAM Role ARN', () => {
    const arn = generateArn(IAMNodeEntity.Role, 'admin-role', '111122223333');
    expect(arn).toBe('arn:aws:iam::111122223333:role/admin-role');
  });

  it('generates Identity Policy ARN', () => {
    const arn = generateArn(IAMNodeEntity.IdentityPolicy, 'read-only', '111122223333');
    expect(arn).toBe('arn:aws:iam::111122223333:policy/read-only');
  });

  it('generates IAM Group ARN', () => {
    const arn = generateArn(IAMNodeEntity.Group, 'developers', '111122223333');
    expect(arn).toBe('arn:aws:iam::111122223333:group/developers');
  });

  it('generates SCP ARN', () => {
    const arn = generateArn(IAMNodeEntity.SCP, 'deny-all', '111122223333');
    expect(arn).toBe('arn:aws:iam::111122223333:policy/deny-all');
  });

  it('generates Permission Boundary ARN', () => {
    const arn = generateArn(IAMNodeEntity.PermissionBoundary, 'boundary', '111122223333');
    expect(arn).toBe('arn:aws:iam::111122223333:policy/boundary');
  });

  it('generates S3 Bucket ARN (no account)', () => {
    const arn = generateArn(IAMNodeResourceEntity.S3Bucket, 'my-bucket');
    expect(arn).toBe('arn:aws:s3:::my-bucket');
  });

  it('generates Lambda ARN with default region', () => {
    const arn = generateArn(IAMNodeResourceEntity.Lambda, 'my-func', '111122223333');
    expect(arn).toBe('arn:aws:lambda:us-east-1:111122223333:function:my-func');
  });

  it('generates Lambda ARN with custom region', () => {
    const arn = generateArn(IAMNodeResourceEntity.Lambda, 'my-func', '111122223333', 'eu-west-1');
    expect(arn).toBe('arn:aws:lambda:eu-west-1:111122223333:function:my-func');
  });

  it('generates EC2 Instance ARN', () => {
    const arn = generateArn(IAMNodeResourceEntity.EC2Instance, 'i-abc123', '111122223333');
    expect(arn).toBe('arn:aws:ec2:us-east-1:111122223333:instance/i-abc123');
  });

  it('generates DynamoDB Table ARN', () => {
    const arn = generateArn(IAMNodeResourceEntity.DynamoDBTable, 'users-table', '111122223333');
    expect(arn).toBe('arn:aws:dynamodb:us-east-1:111122223333:table/users-table');
  });

  it('generates CloudFront ARN', () => {
    const arn = generateArn(IAMNodeResourceEntity.CloudFront, 'dist-123', '111122223333');
    expect(arn).toBe('arn:aws:cloudfront::111122223333:distribution/dist-123');
  });

  it('generates Billing ARN', () => {
    const arn = generateArn(IAMNodeResourceEntity.Billing, 'monthly', '111122223333');
    expect(arn).toBe('arn:aws:budgets::111122223333:budget/monthly');
  });

  it('generates RDS ARN', () => {
    const arn = generateArn(IAMNodeResourceEntity.RDS, 'mydb', '111122223333');
    expect(arn).toBe('arn:aws:rds:us-east-1:111122223333:db:mydb');
  });

  it('generates Secret ARN with random suffix', () => {
    const arn = generateArn(IAMNodeResourceEntity.Secret, 'api-key', '111122223333');
    expect(arn).toMatch(/^arn:aws:secretsmanager:111122223333:secret:api-key-[a-z0-9]{6}$/);
  });

  it('uses default accountId when not provided', () => {
    const arn = generateArn(IAMNodeEntity.User, 'bob');
    expect(arn).toBe('arn:aws:iam::123456789012:user/bob');
  });

  it('throws for unsupported service type', () => {
    expect(() => generateArn('FakeService' as IAMNodeEntity, 'x')).toThrow(
      'Unsupported service type: FakeService'
    );
  });
});
