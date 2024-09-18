import { Schema } from 'ajv';

import { IAMAnyNodeData, IAMNodeEntity } from '@/types';

export interface IAMEntitiesContextState {
  createdNodes: IAMAnyNodeData[];
  createNode: (nodeProps: IAMAnyNodeData) => void;
  removeNode: (nodeId: string) => void;
  maxNodesToCreated?: number;
}

export interface IAMPolicyRoleCreationObjective {
  entityId: string;
  entity: IAMScriptableEntity;
  json_schema: Schema;
  description?: string;
  initial_code: object;
  on_finish_event: string;
  validate_inside_code_editor: boolean;
  resource_affected: string[];
}

export type IAMScriptableEntity = IAMNodeEntity.Policy | IAMNodeEntity.Role;
export type IAMIdentityEntity = IAMNodeEntity.User | IAMNodeEntity.Group;
