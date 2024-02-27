import React, { createContext } from 'react';

import _ from 'lodash';
import { IAMEntitiesContextState, IAMNodeProps } from 'types';

export const IAMEntitiesContext = createContext<IAMEntitiesContextState>({
  createdNodes: [],
  createNode: () => {},
  removeNode: () => {},
});

interface IAMEntitiesContextProps {
  children: React.ReactNode;
}

/**
 * `IAMEntitiesProvider` Acts as a manager for listing, creating, and deleting iam nodes.
 * @component
 *
 * @prop createdNodes - The array of created nodes.
 * @prop createNode - Function to create a new node.
 * @prop removeNode - Function to remove a node.
 *
 * @example
 * <IAMEntitiesProvider>
 *   <ChildComponent />
 * </IAMEntitiesProvider>
 */
const IAMEntitiesProvider: React.FC<IAMEntitiesContextProps> = ({ children }) => {
  const [createdNodes, setCreatedNodes] = React.useState<IAMNodeProps[]>([]);

  useEffect(() => {
    // Default testing nodes
    const nodes: IAMNodeProps[] = _.times(10, idx => {
      const id = idx + 1;
      return {
        id: id.toString(),
        label: `Node ${id}`,
        entity: IAMNodeEntity.User,
        description: `Test description for node ${id}`,
      };
    });

    setCreatedNodes(nodes);
  }, []);

  const createNode = (nodeProps: IAMNodeProps): void => {
    setCreatedNodes(prevNodes => [...prevNodes, nodeProps]);
  };

  const removeNode = (nodeId: string): void => {
    setCreatedNodes(prevNodes => prevNodes.filter(prevNode => prevNode.id !== nodeId));
  };

  return (
    <IAMEntitiesContext.Provider value={{ createdNodes, createNode, removeNode }}>
      {children}
    </IAMEntitiesContext.Provider>
  );
};

export default IAMEntitiesProvider;
