import { createHorizontalGroup, createVerticalGroup } from '@/factories/layout-group-factory';
import { theme } from '@/theme';

export enum LayoutGroupID {
  InLevelUsersLayoutGroup = 'in-level-users-layout-group',
  InLevelElasticCacheLayoutGroup = 'in-level-elasticache-layout-group',
  InLevelPaymentsSquadLayoutGroup = 'in-level-payments-squad-layout-group',
  InLevelNotificationsSquadLayoutGroup = 'in-level-notifications-squad-layout-group',
  InLevelSearchSquadLayoutGroup = 'in-level-search-squad-layout-group',
  InLevelGroupNodesLayoutGroup = 'in-level-group-nodes-layout-group',
}

const IN_LEVEL_USERS_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.InLevelUsersLayoutGroup,
  'left-center',
  theme.sizes.iamNodeHeightInPixels - 15,
  { left: 0, top: 0 }
);

const IN_LEVEL_ELASTICACHE_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelElasticCacheLayoutGroup,
  'top-right',
  theme.sizes.iamNodeWidthInPixels - 100,
  { left: 0, top: 0 }
);

const IN_LEVEL_PAYMENTS_TEAM_USERS_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.InLevelPaymentsSquadLayoutGroup,
  'right-center',
  theme.sizes.iamNodeHeightInPixels - 20,
  { left: 0, top: 0 }
);

const IN_LEVEL_NOTIFICATIONS_TEAM_USERS_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.InLevelNotificationsSquadLayoutGroup,
  'center',
  theme.sizes.iamNodeHeightInPixels - 20,
  { left: 0, top: 0 }
);

const IN_LEVEL_SEARCH_TEAM_USERS_LAYOUT_GROUP = createVerticalGroup(
  LayoutGroupID.InLevelSearchSquadLayoutGroup,
  'left-center',
  theme.sizes.iamNodeHeightInPixels - 20,
  { left: 0, top: 0 }
);

const IN_LEVEL_GROUP_NODES_LAYOUT_GROUP = createHorizontalGroup(
  LayoutGroupID.InLevelGroupNodesLayoutGroup,
  'bottom-center',
  theme.sizes.iamNodeWidthInPixels - 20,
  { left: 0, top: -100 }
);

export const LAYOUT_GROUPS = [
  IN_LEVEL_USERS_LAYOUT_GROUP,
  IN_LEVEL_ELASTICACHE_LAYOUT_GROUP,
  IN_LEVEL_PAYMENTS_TEAM_USERS_LAYOUT_GROUP,
  IN_LEVEL_SEARCH_TEAM_USERS_LAYOUT_GROUP,
  IN_LEVEL_NOTIFICATIONS_TEAM_USERS_LAYOUT_GROUP,
  IN_LEVEL_GROUP_NODES_LAYOUT_GROUP,
];
