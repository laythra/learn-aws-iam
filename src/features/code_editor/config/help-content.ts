import IDENTITY_POLICY_HELP from './help/identity-policy';
import PERMISSION_BOUNDARY_HELP from './help/permission-boundary';
import RESOURCE_POLICY_HELP from './help/resource-policy';
import SCP_HELP from './help/scp';
import TRUST_POLICY_HELP from './help/trust-policy';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';

export type HelpContent = {
  title: string;
  markdown: string;
};

export const HELP_CONTENT: Record<IAMCodeDefinedEntity, HelpContent> = {
  [IAMNodeEntity.IdentityPolicy]: {
    title: 'Identity Policy',
    markdown: IDENTITY_POLICY_HELP,
  },

  [IAMNodeEntity.Role]: {
    title: 'Trust Policy (Role)',
    markdown: TRUST_POLICY_HELP,
  },

  [IAMNodeEntity.ResourcePolicy]: {
    title: 'Resource Policy',
    markdown: RESOURCE_POLICY_HELP,
  },

  [IAMNodeEntity.PermissionBoundary]: {
    title: 'Permission Boundary',
    markdown: PERMISSION_BOUNDARY_HELP,
  },

  [IAMNodeEntity.SCP]: {
    title: 'Service Control Policy (SCP)',
    markdown: SCP_HELP,
  },
};
