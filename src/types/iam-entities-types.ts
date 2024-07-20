import { IAMNodeData, IAMNodeEntity } from '@/types';

export interface IAMEntitiesContextState {
  createdNodes: IAMNodeData[];
  createNode: (nodeProps: IAMNodeData) => void;
  removeNode: (nodeId: string) => void;
  maxNodesToCreated?: number;
}

export type IAMScriptableEntity = IAMNodeEntity.Policy | IAMNodeEntity.Role;
export type IAMIdentityEntity = IAMNodeEntity.User | IAMNodeEntity.Group;
