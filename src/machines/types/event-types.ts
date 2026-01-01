import { ElementID } from '@/config/element-ids';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode, IAMEdge, IAMGroupNode, IAMUserNode } from '@/types/iam-node-types';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

// Serves as a list of all events that the UI elements can send to the state machine
export type GenericEventData =
  | {
      type:
        | 'NEXT'
        | 'NEXT_POPOVER'
        | 'NEXT_POPUP'
        | 'NEXT_FIXED_POPOVER'
        | 'CREATE_USER_POPUP_OPENED'
        | 'HIDE_POPOVERS'
        | 'HIDE_FIXED_POPOVERS'
        | 'CREATE_POLICY_POPUP_OPENED'
        | 'CREATE_IAM_IDENTITY_POPUP_OPENED'
        | 'TOGGLE_SIDE_PANEL'
        | StatelessStateMachineEvent;
    }
  | {
      type: StatefulStateMachineEvent.AddIAMUserGroupNode;
      node_entity: IAMNodeEntity.Group | IAMNodeEntity.User;
      node_data: Partial<IAMUserNode['data']> | Partial<IAMGroupNode['data']>;
    }
  | {
      type: StatefulStateMachineEvent.ADDIAMRoleNode;
      doc_string: string;
      account_id?: string;
      label: string;
    }
  | {
      type: StatefulStateMachineEvent.EditIAMPolicyNode;
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
      type: StatefulStateMachineEvent.AddIAMResourcePolicyNode;
      doc_string: string;
      label: string;
      account_id?: string;
    }
  | {
      type: StatefulStateMachineEvent.AddIAMSCPNode;
      doc_string: string;
      label: string;
    }
  | {
      type: StatefulStateMachineEvent.AddIAMPermissionBoundaryNode;
      doc_string: string;
      label: string;
      account_id?: string;
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
      newMetadata: Partial<IAMAnyNode['data']>;
    }
  | { type: 'UPDATE_RED_DOT_VISIBILITY'; element_ids: ElementID[]; is_visible: boolean };
