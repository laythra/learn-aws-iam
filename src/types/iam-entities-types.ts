import { IAMAnyNode, IAMNodeEntity } from '@/types';

export interface IAMEntitiesContextState {
  createdNodes: IAMAnyNode[];
  createNode: (nodeProps: IAMAnyNode) => void;
  removeNode: (nodeId: string) => void;
  maxNodesToCreated?: number;
}

export type IAMScriptableEntity = IAMNodeEntity.Policy | IAMNodeEntity.Role | IAMNodeEntity.SCP;
export type IAMIdentityEntity = IAMNodeEntity.User | IAMNodeEntity.Group;
