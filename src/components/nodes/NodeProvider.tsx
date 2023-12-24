import React, { createContext } from 'react';
import { IAMNode } from 'types';

interface NodeContextProps {
  children: React.ReactNode;
}

interface NodeContextState {
  selectedNode: IAMNode;
  setSelectedNode: React.Dispatch<React.SetStateAction<IAMNode>>;
}

const defaultNode: IAMNode = {
  id: '',
  type: 'dummyNode',
  description: 'Click on a node to view its details',
}

export const NodeContext = createContext<NodeContextState>({
  selectedNode: defaultNode,
  setSelectedNode: () => {},
});

const NodeProvider: React.FC<NodeContextProps> = ({ children }) => {
  const [selectedNode, setSelectedNode] = React.useState(defaultNode);

  return (
    <NodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </NodeContext.Provider>
  );
};

export default NodeProvider;
