import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode, IAMEdge, IAMGroupNode, IAMUserNode } from '@/types/iam-node-types';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

/**
 * Shared top-level event handlers for XState machines.
 *
 * This single const contains ALL shared events that can be used across state machines.
 * Each state machine spreads this into its `on:` config.
 *
 * Usage in state machine:
 * ```ts
 * on: {
 *   ...SHARED_TOP_LEVEL_EVENTS,
 * }
 * ```
 *
 * Unfortunately, this is a loosely typed approach. The correct way of doing this would be to use
 * `createStateConfig` from XState to create modular state nodes with shared event handlers,
 * but due to limitations, I am unable to do so. See comments in `common-state-machine-setup.ts`.
 */
export const SHARED_TOP_LEVEL_EVENTS = {
  // =========================================================================
  // User/Group Node Management
  // =========================================================================
  [StatefulStateMachineEvent.AddIAMUserGroupNode]: {
    actions: [
      {
        type: 'add_iam_user_group_node' as const,
        params: ({
          event,
        }: {
          event: {
            type: StatefulStateMachineEvent.AddIAMUserGroupNode;
            node_entity: IAMNodeEntity.Group | IAMNodeEntity.User;
            node_data: Partial<IAMUserNode['data']> | Partial<IAMGroupNode['data']>;
          };
        }) => ({
          params: event.node_data,
          nodeType: event.node_entity,
        }),
      },
    ],
  },

  // =========================================================================
  // Node Creation (Policies, Roles, etc.)
  // =========================================================================
  [StatefulStateMachineEvent.AddIAMNode]: {
    actions: [
      {
        type: 'add_iam_node' as const,
        params: ({
          event,
        }: {
          event: {
            type: StatefulStateMachineEvent.AddIAMNode;
            doc_string: string;
            label: string;
            node_entity: IAMCodeDefinedEntity;
            account_id?: string;
          };
        }) => ({
          docString: event.doc_string,
          label: event.label,
          policyNodeType: event.node_entity,
          accountId: event.account_id,
        }),
      },
    ],
  },

  // =========================================================================
  // Edge/Node Connections
  // =========================================================================
  [StatefulStateMachineEvent.ConnectNodes]: {
    actions: [
      {
        type: 'connect_nodes' as const,
        params: ({
          event,
        }: {
          event: {
            type: StatefulStateMachineEvent.ConnectNodes;
            sourceNode: IAMAnyNode;
            targetNode: IAMAnyNode;
            isInternalConnection?: boolean;
          };
        }) => ({
          sourceNode: event.sourceNode,
          targetNode: event.targetNode,
          isInternalConnection: event.isInternalConnection,
        }),
      },
    ],
  },

  // =========================================================================
  // Edge Deletion
  // =========================================================================
  [StatefulStateMachineEvent.DeleteEdge]: {
    actions: [
      {
        type: 'delete_edge' as const,
        params: ({
          event,
        }: {
          event: {
            type: StatefulStateMachineEvent.DeleteEdge;
            edge: IAMEdge;
          };
        }) => ({
          edge: event.edge,
        }),
      },
    ],
  },

  [StatefulStateMachineEvent.DeleteEdges]: {
    actions: [
      {
        type: 'delete_edges' as const,
        params: ({
          event,
        }: {
          event: {
            type: StatefulStateMachineEvent.DeleteEdges;
            edgeIds: string[];
          };
        }) => ({
          edgeIds: event.edgeIds,
        }),
      },
    ],
  },

  // =========================================================================
  // Node Deletion
  // =========================================================================
  [StatefulStateMachineEvent.DeleteNode]: {
    actions: [
      {
        type: 'delete_node' as const,
        params: ({
          event,
        }: {
          event: {
            type: StatefulStateMachineEvent.DeleteNode;
            node: IAMAnyNode;
          };
        }) => ({
          node: event.node,
        }),
      },
    ],
  },

  // =========================================================================
  // Policy Editing
  // =========================================================================
  [StatefulStateMachineEvent.EditIAMPolicyNode]: {
    actions: [
      {
        type: 'edit_policy_node' as const,
        params: ({
          event,
        }: {
          event: {
            type: StatefulStateMachineEvent.EditIAMPolicyNode;
            node_id: string;
            doc_string: string;
          };
        }) => ({
          nodeId: event.node_id,
          docString: event.doc_string,
        }),
      },
    ],
  },

  // =========================================================================
  // Node Metadata Editing
  // =========================================================================
  [StatefulStateMachineEvent.EditNodeMetadata]: {
    actions: [
      {
        type: 'edit_node_attributes' as const,
        params: ({
          event,
        }: {
          event: {
            type: StatefulStateMachineEvent.EditNodeMetadata;
            nodeId: string;
            newMetadata: Partial<IAMAnyNode['data']>;
          };
        }) => ({
          nodeId: event.nodeId,
          attributes: event.newMetadata,
        }),
      },
    ],
  },

  // =========================================================================
  // Node Aggregation (Level 12)
  // =========================================================================
  [StatelessStateMachineEvent.AggregateUserNodes]: {
    actions: [
      {
        type: 'aggregate_user_nodes' as const,
      },
    ],
  },

  [StatefulStateMachineEvent.DeaggregateUserNodes]: {
    actions: [
      {
        type: 'deaggregate_user_nodes' as const,
        params: ({
          event,
        }: {
          event: {
            type: StatefulStateMachineEvent.DeaggregateUserNodes;
            nodeId: string;
          };
        }) => ({
          nodeId: event.nodeId,
        }),
      },
    ],
  },

  // =========================================================================
  // Popover/Popup Visibility
  // =========================================================================
  [StatelessStateMachineEvent.HidePopovers]: {
    actions: 'hide_popovers' as const,
  },

  [StatelessStateMachineEvent.HideHelpPopover]: {
    actions: 'hide_help_popover' as const,
  },

  [StatelessStateMachineEvent.ShowHelpPopover]: {
    actions: 'show_help_popover' as const,
  },

  // =========================================================================
  // Side Panel
  // =========================================================================
  TOGGLE_SIDE_PANEL: {
    actions: 'toggle_side_panel' as const,
  },
};
