import { GenericContext } from '@/levels/types/context-types';
import { BaseFinishEventMap } from '@/levels/types/objective-types';
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
    policy_creation_objectives: [],
    user_group_creation_objectives: [],
    edges_connection_objectives: [],
    level_objectives: [],
    whitelisted_element_ids: [],
    show_popups: false,
    show_popovers: false,
    show_fixed_popovers: false,
    show_unnecessary_edges_or_nodes_warning: false,
    popup_content: undefined,
    popover_content: undefined,
    in_tutorial_state: false,
    side_panel_open: false,
    edges_management_disabled: false,
    layout_groups: [],
    ...props,
  };
}
