import { INITIAL_TUTORIAL_USER_NODES } from './nodes/user-nodes';
import { EDGE_CONNECTION_OBJECTIVES } from './objectives/edge-connection-objectives';
import { SCP_CREATION_OBJECTIVES } from './objectives/scp-creation-objectives';
import { FIXED_POPOVER_MESSAGES } from './tutorial_messages/fixed-popover-messages';
import { POPOVER_TUTORIAL_MESSAGES } from './tutorial_messages/popover-tutorial-messages';
import { POPUP_TUTORIAL_MESSAGES } from './tutorial_messages/popup-tutorial-messages';
import { FinishEventMap } from './types/finish-event-enums';
import { LevelObjectiveID } from './types/objective-enums';
import { createStateMachineSetup } from '../common-state-machine-setup';
import { DEFAULT_ROLE_POLICY_OBJECTIVES_MAP } from '../config';
import { ElementID } from '@/config/element-ids';
import { IAMNodeEntity } from '@/types';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const stateMachine = createStateMachineSetup<LevelObjectiveID, FinishEventMap>(
  POPOVER_TUTORIAL_MESSAGES,
  POPUP_TUTORIAL_MESSAGES,
  EDGE_CONNECTION_OBJECTIVES
).createMachine({
  id: 'level9_state_machine',
  initial: 'inside_tutorial',
  context: {
    level_title: 'Tag Based Access Control (TBAC)',
    level_description: 'This level introduces you to Tag Based Access Control (TBAC) in AWS IAM.',
    level_number: 9,
    next_popover_index: 0,
    next_popup_index: 0,
    next_fixed_popover_index: 0,
    show_popovers: false,
    show_popups: false,
    show_fixed_popovers: false,
    nodes: [],
    edges: [],
    level_objectives: [],
    policy_creation_objectives: [],
    edges_connection_objectives: [],
    policy_edit_objectives: [],
    user_group_creation_objectives: [],
    role_creation_objectives: [],
    use_multi_account_canvas: false,
    side_panel_open: false,
    fixed_popover_messages: FIXED_POPOVER_MESSAGES,
    nodes_connnections: [],
    all_policy_creation_objectives: [],
    restricted_element_ids: [ElementID.CodeEditorPolicyTab, ElementID.CodeEditorRoleTab],
    objectives_map: {
      ...DEFAULT_ROLE_POLICY_OBJECTIVES_MAP,
      [IAMNodeEntity.SCP]: { objectives: SCP_CREATION_OBJECTIVES, current_index: 0 },
    },
  },
  on: {
    TOGGLE_SIDE_PANEL: { actions: 'toggle_side_panel' },
    [StatefulStateMachineEvent.AddIAMUserGroupNode]: {
      actions: [
        {
          type: 'add_iam_user_group_node',
          params: ({ event }) => ({ params: event.node_data, nodeType: event.node_entity }),
        },
      ],
    },
    [StatefulStateMachineEvent.ADDIAMRoleNode]: {
      actions: [
        {
          type: 'add_role_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            accountId: event.account_id,
            label: event.label,
          }),
        },
      ],
    },
    [StatefulStateMachineEvent.AddIAMSCPNode]: {
      actions: [
        {
          type: 'add_scp_node',
          params: ({ event }) => ({
            docString: event.doc_string,
            label: event.label,
          }),
        },
      ],
    },
    [StatefulStateMachineEvent.ConnectNodes]: {
      actions: [
        {
          type: 'connect_nodes',
          params: ({ event }) => ({ sourceNode: event.sourceNode, targetNode: event.targetNode }),
        },
      ],
    },
    [StatefulStateMachineEvent.DeleteEdge]: {
      actions: [
        {
          type: 'delete_edge',
          params: ({ event }) => ({ edge: event.edge }),
        },
      ],
    },
    [StatefulStateMachineEvent.DeleteNode]: {
      actions: [
        {
          type: 'delete_node',
          params: ({ event }) => ({ node: event.node }),
        },
      ],
    },
    [StatelessStateMachineEvent.HidePopovers]: { actions: 'hide_popovers' },
    [StatelessStateMachineEvent.HideHelpPopover]: { actions: 'hide_help_popover' },
    [StatelessStateMachineEvent.ShowHelpPopover]: { actions: 'show_help_popover' },
  },
  states: {
    inside_tutorial: {
      onDone: 'inside_level',
      initial: 'tutorial_popup1',
      entry: [
        {
          type: 'assign_nodes',
          params: { nodes: INITIAL_TUTORIAL_USER_NODES },
        },
      ],
      states: {
        tutorial_popup1: {
          entry: 'next_popup',
          on: {
            NEXT_POPUP: 'tutorial_popover1',
          },
        },
        tutorial_popover1: {
          entry: ['hide_popups', 'next_popover'],
          on: {
            [StatelessStateMachineEvent.IAMNodeTagsOpened]: 'fixed_popover1',
          },
        },
        fixed_popover1: {
          entry: ['hide_popovers', 'show_fixed_popover'],
          // on: {
          //   NEXT_POPUP: 'tutorial_popover2',
          // },
        },
      },
    },
    inside_level: {},
  },
});
