import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMAnyNode, IAMEdge, IAMGroupNode, IAMUserNode } from '@/types/iam-node-types';
import { DataEvent, VoidEvent } from '@/types/state-machine-event-enums';

export type GenericEventData =
  | {
      type:
        | VoidEvent.NextPopover
        | VoidEvent.NextPopup
        | VoidEvent.NextFixedPopover
        | VoidEvent.HidePopovers
        | VoidEvent.HideFixedPopover
        | VoidEvent.CreateIAMIdentityPopupOpened
        | VoidEvent.ToggleSidePanel
        | VoidEvent;
    }
  | {
      type: DataEvent.AddIAMUserGroupNode;
      node_entity: IAMNodeEntity.Group | IAMNodeEntity.User;
      node_data:
        | IAMNodeDataOverrides<IAMUserNode['data']>
        | IAMNodeDataOverrides<IAMGroupNode['data']>;
    }
  | {
      type: DataEvent.EditIAMIdentityPolicyNode;
      node_id: string;
      doc_string: string;
    }
  | {
      type: DataEvent.AddIAMNode;
      doc_string: string;
      label: string;
      account_id?: string;
      resource_node_id?: string;
      node_entity: IAMCodeDefinedEntity;
    }
  | {
      type: DataEvent.ConnectNodes;
      sourceNode: IAMAnyNode;
      targetNode: IAMAnyNode;
      isInternalConnection?: boolean;
    }
  | {
      type: DataEvent.DeleteEdge;
      edge: IAMEdge;
    }
  | {
      type: DataEvent.DeleteNode;
      node: IAMAnyNode;
    }
  | {
      type: DataEvent.DeleteEdges;
      edgeIds: string[];
    }
  | {
      type: DataEvent.EditNodeMetadata;
      nodeId: string;
      newMetadata: IAMNodeDataOverrides<IAMAnyNode['data']>;
    }
  | {
      type: DataEvent.LogAnalyticsEvent;
      name: string;
      payload: Record<string, unknown>;
    };
