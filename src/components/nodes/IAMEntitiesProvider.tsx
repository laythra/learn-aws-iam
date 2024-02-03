import React, { createContext, useEffect } from 'react';

import _ from 'lodash';
import { IAMEntitiesContextState, IAMNodeEntity, IAMNodeProps } from 'types';

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
        iamNodeClass: IAMNodeEntity.User,
        description: `Test description for node ${id}`,
      };
    });

    setCreatedNodes(nodes);
  }, []);

  const createNode = (nodeClass: IAMNodeEntity): void => {
    const timestmap = Date.now();
    const node: IAMNodeProps = {
      id: timestmap.toString(),
      label: `${nodeClass} ${createdNodes.length + 1}`,
      iamNodeClass: nodeClass,
      description: '',
    };

    setCreatedNodes(prevNodes => [...prevNodes, node]);
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
