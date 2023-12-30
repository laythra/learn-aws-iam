import React, { createContext } from 'react';

import { IAMNodeProps } from 'types';

interface NodeContextProps {
  children: React.ReactNode;
}

type SelectedNodeProps = Pick<IAMNodeProps, 'id' | 'type' | 'description'>;

interface NodeContextState {
  selectedNode: SelectedNodeProps;
  setSelectedNode: React.Dispatch<React.SetStateAction<SelectedNodeProps>>;
}

const defaultNode: SelectedNodeProps = {
  id: '',
  type: 'dummyNode',
  description: 'Click on a node to view its details',
};

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
