import { createHorizontalGroup, createVerticalGroup } from '@/factories/layout-group-factory';
import { theme } from '@/theme';

export enum LayoutGroupID {
  InLevelUsersLayoutGroup = 'in-level-users-layout-group',
  InLevelElasticCacheLayoutGroup = 'in-level-elasticache-layout-group',
  InLevelPaymentsSquadLayoutGroup = 'in-level-payments-squad-layout-group',
  InLevelNotificationsSquadLayoutGroup = 'in-level-notifications-squad-layout-group',
  InLevelSearchSquadLayoutGroup = 'in-level-search-squad-layout-group',
  InLevelGroupNodesLayoutGroup = 'in-level-group-nodes-layout-group',
  InLevelPermissionBoundaryLayoutGroup = 'in-level-permission-boundary-layout-group',
  InLevelAccessDelegationPolicyLayoutGroup = 'in-level-access-delegation-policy-layout-group',
}

const IN_LEVEL_USERS_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.InLevelUsersLayoutGroup,
  'left-center',
  theme.sizes.iamNodeHeightInPixels - 15,
  { left: 0, top: 0 }
);

const IN_LEVEL_ELASTICACHE_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelElasticCacheLayoutGroup,
  'bottom-center',
  theme.sizes.iamNodeWidthInPixels + 20,
  { left: 0, top: 40 }
);

const IN_LEVEL_PAYMENTS_TEAM_USERS_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelPaymentsSquadLayoutGroup,
  'right-center',
  theme.sizes.iamNodeHeightInPixels - 20,
  { left: 0, top: theme.sizes.iamNodeHeightInPixels + 20 }
);

const IN_LEVEL_NOTIFICATIONS_TEAM_USERS_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelNotificationsSquadLayoutGroup,
  'left-center',
  theme.sizes.iamNodeHeightInPixels - 20,
  { left: 0, top: theme.sizes.iamNodeHeightInPixels + 20 }
);

const IN_LEVEL_SEARCH_TEAM_USERS_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelSearchSquadLayoutGroup,
  'center',
  theme.sizes.iamNodeHeightInPixels - 20,
  { left: 0, top: theme.sizes.iamNodeHeightInPixels + 20 }
);

const IN_LEVEL_GROUP_NODES_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelGroupNodesLayoutGroup,
  'top-center',
  theme.sizes.iamNodeWidthInPixels,
  { left: 0, top: theme.sizes.iamNodeHeightInPixels + 50 }
);

const IN_LEVEL_PERMISSION_BOUNDARY_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelPermissionBoundaryLayoutGroup,
  'right-center',
  theme.sizes.iamNodeWidthInPixels,
  { left: -theme.sizes.iamNodeWidthInPixels - 20, top: 0 }
);

const IN_LEVEL_ACCESS_DELEGATION_POLICY_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelAccessDelegationPolicyLayoutGroup,
  'bottom-center',
  theme.sizes.iamNodeWidthInPixels,
  { left: 0, top: -theme.sizes.iamNodeHeightInPixels + 20 }
);

export const LAYOUT_GROUPS = [
  IN_LEVEL_USERS_LAYOUT_GROUP,
  IN_LEVEL_ELASTICACHE_LAYOUT_GROUP,
  IN_LEVEL_PAYMENTS_TEAM_USERS_LAYOUT_GROUP,
  IN_LEVEL_SEARCH_TEAM_USERS_LAYOUT_GROUP,
  IN_LEVEL_NOTIFICATIONS_TEAM_USERS_LAYOUT_GROUP,
  IN_LEVEL_GROUP_NODES_LAYOUT_GROUP,
  IN_LEVEL_PERMISSION_BOUNDARY_LAYOUT_GROUP,
  IN_LEVEL_ACCESS_DELEGATION_POLICY_LAYOUT_GROUP,
];
