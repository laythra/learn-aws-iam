import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import { IAMAnyNode, IAMEdge, IAMGroupNode, IAMUserNode } from '@/types/iam-node-types';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export type GenericEventData =
  | {
      type:
        | 'NEXT_POPOVER'
        | 'NEXT_POPUP'
        | 'NEXT_FIXED_POPOVER'
        | 'HIDE_POPOVERS'
        | 'HIDE_FIXED_POPOVERS'
        | 'CREATE_IAM_IDENTITY_POPUP_OPENED'
        | 'TOGGLE_SIDE_PANEL'
        | StatelessStateMachineEvent;
    }
  | {
      type: StatefulStateMachineEvent.AddIAMUserGroupNode;
      node_entity: IAMNodeEntity.Group | IAMNodeEntity.User;
      node_data:
        | IAMNodeDataOverrides<IAMUserNode['data']>
        | IAMNodeDataOverrides<IAMGroupNode['data']>;
    }
  | {
      type: StatefulStateMachineEvent.EditIAMIdentityPolicyNode;
      node_id: string;
      doc_string: string;
    }
  | {
      type: StatefulStateMachineEvent.AddIAMNode;
      doc_string: string;
      label: string;
      account_id?: string;
      node_entity: IAMCodeDefinedEntity;
    }
  | {
      type: StatefulStateMachineEvent.ConnectNodes;
      sourceNode: IAMAnyNode;
      targetNode: IAMAnyNode;
      isInternalConnection?: boolean;
    }
  | {
      type: StatefulStateMachineEvent.DeleteEdge;
      edge: IAMEdge;
    }
  | {
      type: StatefulStateMachineEvent.DeleteNode;
      node: IAMAnyNode;
    }
  | {
      type: StatefulStateMachineEvent.DeleteEdges;
      edgeIds: string[];
    }
  | {
      type: StatefulStateMachineEvent.DeaggregateUserNodes;
      nodeId: string;
    }
  | {
      type: StatefulStateMachineEvent.EditNodeMetadata;
      nodeId: string;
      newMetadata: IAMNodeDataOverrides<IAMAnyNode['data']>;
    }
  | {
      type: StatefulStateMachineEvent.LogAnalyticsEvent;
      name: string;
      payload: Record<string, unknown>;
    };
