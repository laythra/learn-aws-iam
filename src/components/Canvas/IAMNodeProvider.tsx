import React, { createContext } from 'react';

import { IAMNodeEntity, IAMNodeData, IAMUserNodeData, IAMGroupNodeData } from '@/types';

interface IAMNodeContextProps {
  children: React.ReactNode;
}

interface IAMNodeContextState {
  selectedNode: IAMNodeData | IAMUserNodeData | IAMGroupNodeData;
  setSelectedNode: React.Dispatch<
    React.SetStateAction<IAMNodeData | IAMUserNodeData | IAMGroupNodeData>
  >;
}

const defaultNode: IAMNodeData = {
  id: '',
  label: '',
  description: 'Click on a node to view its details',
  entity: IAMNodeEntity.User,
};

export const IAMNodeContext = createContext<IAMNodeContextState>({
  selectedNode: defaultNode,
  setSelectedNode: () => {},
});

/*
 * `IAMNodeProvider` provides the selectedNode state and its setter to its children.
 */
const IAMNodeProvider: React.FC<IAMNodeContextProps> = ({ children }) => {
  const [selectedNode, setSelectedNode] = React.useState(defaultNode);

  return (
    <IAMNodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </IAMNodeContext.Provider>
  );
};

export default IAMNodeProvider;
