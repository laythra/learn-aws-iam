import { IAMAnyNodeData, IAMNodeEntity } from '@/types';

export interface IAMEntitiesContextState {
  createdNodes: IAMAnyNodeData[];
  createNode: (nodeProps: IAMAnyNodeData) => void;
  removeNode: (nodeId: string) => void;
  maxNodesToCreated?: number;
}

export type IAMScriptableEntity = IAMNodeEntity.Policy | IAMNodeEntity.Role;
export type IAMIdentityEntity = IAMNodeEntity.User | IAMNodeEntity.Group;
