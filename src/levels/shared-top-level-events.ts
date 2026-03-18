import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMAnyNode, IAMEdge, IAMGroupNode, IAMUserNode } from '@/types/iam-node-types';
import { DataEvent, VoidEvent } from '@/types/state-machine-event-enums';

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
  [DataEvent.AddIAMUserGroupNode]: {
    actions: [
      {
        type: 'add_iam_user_group_node' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.AddIAMUserGroupNode;
            node_entity: IAMNodeEntity.Group | IAMNodeEntity.User;
            node_data:
              | IAMNodeDataOverrides<IAMUserNode['data']>
              | IAMNodeDataOverrides<IAMGroupNode['data']>;
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
  [DataEvent.AddIAMNode]: {
    actions: [
      {
        type: 'add_iam_node' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.AddIAMNode;
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
  [DataEvent.ConnectNodes]: {
    actions: [
      {
        type: 'connect_nodes' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.ConnectNodes;
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
  [DataEvent.DeleteEdge]: {
    actions: [
      {
        type: 'delete_edge' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.DeleteEdge;
            edge: IAMEdge;
          };
        }) => ({
          edge: event.edge,
        }),
      },
    ],
  },

  [DataEvent.DeleteEdges]: {
    actions: [
      {
        type: 'delete_edges' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.DeleteEdges;
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
  [DataEvent.DeleteNode]: {
    actions: [
      {
        type: 'delete_node' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.DeleteNode;
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
  [DataEvent.EditIAMIdentityPolicyNode]: {
    actions: [
      {
        type: 'edit_policy_node' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.EditIAMIdentityPolicyNode;
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
  [DataEvent.EditNodeMetadata]: {
    actions: [
      {
        type: 'edit_node_attributes' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.EditNodeMetadata;
            nodeId: string;
            newMetadata: IAMNodeDataOverrides<IAMAnyNode['data']>;
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
  [VoidEvent.AggregateUserNodes]: {
    actions: [
      {
        type: 'aggregate_user_nodes' as const,
      },
    ],
  },

  [DataEvent.DeaggregateUserNodes]: {
    actions: [
      {
        type: 'deaggregate_user_nodes' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.DeaggregateUserNodes;
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
  [VoidEvent.HidePopovers]: {
    actions: 'hide_popovers' as const,
  },

  [VoidEvent.HideFixedPopover]: {
    actions: 'hide_fixed_popovers' as const,
  },

  [DataEvent.LogAnalyticsEvent]: {
    actions: [
      {
        type: 'log_analytics_event' as const,
        params: ({
          event,
        }: {
          event: {
            type: DataEvent.LogAnalyticsEvent;
            name: string;
            payload: Record<string, unknown>;
          };
        }) => ({
          name: event.name,
          payload: event.payload,
        }),
      },
    ],
  },
  // =========================================================================
  // Side Panel
  // =========================================================================
  [VoidEvent.ToggleSidePanel]: {
    actions: 'toggle_side_panel' as const,
  },
};
