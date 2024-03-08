import { IAMNodeProps, IAMNodeEntity } from 'types';

export interface IAMEntitiesContextState {
  createdNodes: IAMNodeProps[];
  createNode: (nodeProps: IAMNodeProps) => void;
  removeNode: (nodeId: string) => void;
  maxNodesToCreated?: number;
}

export type IAMScriptableEntity = IAMNodeEntity.Policy | IAMNodeEntity.Role;
export type IAMIdentityEntity = IAMNodeEntity.User | IAMNodeEntity.Group;
