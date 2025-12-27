import { IAMNodeEntity } from '@/types/iam-enums';

export const IAMCodeDefinedEntities = [
  IAMNodeEntity.Policy,
  IAMNodeEntity.Role,
  IAMNodeEntity.SCP,
  IAMNodeEntity.ResourcePolicy,
  IAMNodeEntity.PermissionBoundary,
] as const;
