import { IAMNodeEntity } from '@/types';

export const IAMCodeDefinedEntities = [
  IAMNodeEntity.Policy,
  IAMNodeEntity.Role,
  IAMNodeEntity.SCP,
  IAMNodeEntity.ResourcePolicy,
] as const;
