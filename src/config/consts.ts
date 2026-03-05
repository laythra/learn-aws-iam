import { IAMNodeEntity } from '@/types/iam-enums';

export const IAMCodeDefinedEntities = [
  IAMNodeEntity.IdentityPolicy,
  IAMNodeEntity.Role,
  IAMNodeEntity.SCP,
  IAMNodeEntity.ResourcePolicy,
  IAMNodeEntity.PermissionBoundary,
] as const;
