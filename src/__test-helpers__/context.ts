import { DEFAULT_ROLE_POLICY_OBJECTIVES_MAP } from '@/machines/config';
import { GenericContext } from '@/machines/types';
import { BaseFinishEventMap } from '@/machines/types';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

export function createMockContext<
  TLevelObjectiveID = string,
  TFinishEventMap extends BaseFinishEventMap = BaseFinishEventMap,
>(
  props: Partial<GenericContext<TLevelObjectiveID, TFinishEventMap>>
): GenericContext<TLevelObjectiveID, TFinishEventMap> {
  return {
    level_description: 'IAM MOCK',
    level_number: 1,
    level_title: 'IAM MOCK',
    policy_edit_objectives: [],
    nodes: [] as IAMAnyNode[],
    edges: [] as IAMEdge[],
    nodes_connnections: [],
    policy_creation_objectives: [],
    user_group_creation_objectives: [],
    role_creation_objectives: [],
    edges_connection_objectives: [],
    fixed_popover_messages: [],
    level_objectives: [],
    whitelisted_element_ids: [],
    elements_with_animated_red_dot: [],
    show_popups: false,
    show_popovers: false,
    show_fixed_popovers: false,
    show_unncessary_edges_or_nodes_warning: false,
    popup_content: undefined,
    popover_content: undefined,
    next_policy_creation_objectives_index: 0,
    next_role_creation_objectives_index: 0,
    next_edges_connection_objectives_index: 0,
    next_popup_index: 0,
    next_popover_index: 0,
    next_fixed_popover_index: 0,
    use_multi_account_canvas: false,
    in_tutorial_state: false,
    side_panel_open: false,
    edges_management_disabled: false,
    all_policy_creation_objectives: [],
    objectives_map: DEFAULT_ROLE_POLICY_OBJECTIVES_MAP,
    layout_groups: [],
    ...props,
  };
}
