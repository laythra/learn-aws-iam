import { createHorizontalGroup, createVerticalGroup } from '@/factories/layout-group-factory';
import { theme } from '@/theme';

export enum LayoutGroupID {
  InLevelUsersLayoutGroup = 'in-level-users-layout-group',
  InLevelElasticCacheLayoutGroup = 'in-level-elasticache-layout-group',
  InLevelPaymentsSquadLayoutGroup = 'in-level-payments-squad-layout-group',
  InLevelNotificationsSquadLayoutGroup = 'in-level-notifications-squad-layout-group',
  InLevelSearchSquadLayoutGroup = 'in-level-search-squad-layout-group',
  InLevelGroupNodesLayoutGroup = 'in-level-group-nodes-layout-group',
  InLevelElasticCacheMgmtPolicyLayoutGroup = 'in-level-elasticache-mgmt-policy-layout-group',
}

const IN_LEVEL_USERS_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.InLevelUsersLayoutGroup,
  'left-center',
  theme.sizes.iamNodeHeightInPixels - 15,
  { left: 0, top: 0 }
);

const IN_LEVEL_ELASTICACHE_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelElasticCacheLayoutGroup,
  'top-center',
  theme.sizes.iamNodeWidthInPixels + 20,
  { left: 0, top: 40 }
);

const IN_LEVEL_PAYMENTS_TEAM_USERS_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.InLevelPaymentsSquadLayoutGroup,
  'bottom-right',
  theme.sizes.iamNodeHeightInPixels - 20,
  { left: 0, top: 0 }
);

const IN_LEVEL_NOTIFICATIONS_TEAM_USERS_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.InLevelNotificationsSquadLayoutGroup,
  'bottom-center',
  theme.sizes.iamNodeHeightInPixels - 20,
  { left: 0, top: 0 }
);

const IN_LEVEL_SEARCH_TEAM_USERS_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.InLevelSearchSquadLayoutGroup,
  'bottom-left',
  theme.sizes.iamNodeHeightInPixels - 20,
  { left: 0, top: 0 }
);

const IN_LEVEL_GROUP_NODES_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelGroupNodesLayoutGroup,
  'bottom-center',
  theme.sizes.iamNodeWidthInPixels - 20,
  { left: 0, top: -100 }
);

const ELASTICACHE_MANAGEMENT_POLICY_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelElasticCacheMgmtPolicyLayoutGroup,
  'top-center',
  theme.sizes.iamNodeWidthInPixels,
  { left: 0, top: theme.sizes.iamNodeHeightInPixels + 20 }
);

export const LAYOUT_GROUPS = [
  IN_LEVEL_USERS_LAYOUT_GROUP,
  IN_LEVEL_ELASTICACHE_LAYOUT_GROUP,
  IN_LEVEL_PAYMENTS_TEAM_USERS_LAYOUT_GROUP,
  IN_LEVEL_SEARCH_TEAM_USERS_LAYOUT_GROUP,
  IN_LEVEL_NOTIFICATIONS_TEAM_USERS_LAYOUT_GROUP,
  IN_LEVEL_GROUP_NODES_LAYOUT_GROUP,
  ELASTICACHE_MANAGEMENT_POLICY_LAYOUT_GROUP,
];
