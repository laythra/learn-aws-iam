import { IAMNodeProps } from 'types';

export interface IAMEntitiesContextState {
  createdNodes: IAMNodeProps[];
  createNode: (nodeProps: IAMNodeProps) => void;
  removeNode: (nodeId: string) => void;
  maxNodesToCreated?: number;
}
