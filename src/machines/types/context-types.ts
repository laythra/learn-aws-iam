import { DynamicAnimationOptions } from 'framer-motion';

import {
  BaseCreationObjective,
  BaseFinishEventMap,
  EdgeConnectionObjective,
  IAMPolicyEditObjective,
  IAMUserGroupCreationObjective,
  LevelObjective,
} from './objective-types';
import {
  FixedPopoverMessage,
  PopoverTutorialMessage,
  PopupTutorialMessage,
} from './tutorial-message-types';
import { ElementID } from '@/config/element-ids';
import type { IAMAnyNode, IAMEdge, NodeLayoutGroup } from '@/types';
import { IAMNodeEntity } from '@/types';

export type HelpTip = 'ConnectNodes' | 'CreatePolicies';

export interface GenericContext<TObjectiveID, TBaseFinishEventMap extends BaseFinishEventMap> {
  edges: IAMEdge[];
  edges_connection_objectives: EdgeConnectionObjective<TBaseFinishEventMap>[];
  level_description: string;
  level_finished?: boolean;
  level_number: number;
  level_objectives: LevelObjective<TObjectiveID, TBaseFinishEventMap>[];
  level_title: string;
  nodes: IAMAnyNode[];
  policy_creation_objectives: BaseCreationObjective<TBaseFinishEventMap>[];
  policy_edit_objectives: IAMPolicyEditObjective<TBaseFinishEventMap>[];
  popover_content?: PopoverTutorialMessage;
  popup_content?: PopupTutorialMessage;
  show_popovers: boolean;
  show_popups: boolean;
  show_fixed_popovers: boolean;
  fixed_popover_content?: FixedPopoverMessage;
  side_panel_open?: boolean;
  user_group_creation_objectives: IAMUserGroupCreationObjective<TBaseFinishEventMap>[];
  highlighted_element_id?: string;
  in_tutorial_state?: boolean;
  show_help_popover?: boolean;
  whitelisted_element_ids?: string[];
  help_tips?: HelpTip[];
  /*
    Defines the list of elements that are always hidden or disabled, regardless of the current state.
  */
  restricted_element_ids?: string[];
  edges_management_disabled?: boolean;
  animations?: Record<string, DynamicAnimationOptions>;
  identity_creation_popup_default_value?: IAMNodeEntity.User | IAMNodeEntity.Group;
  elements_with_animated_red_dot?: ElementID[];
  show_unncessary_edges_or_nodes_warning?: boolean;
  layout_groups: NodeLayoutGroup[];
  blocked_connections?: { from: string; to: string }[];
}
