import React, { createContext } from 'react';

import { IAMNodeProps } from 'types';

interface IAMNodeContextProps {
  children: React.ReactNode;
}

type SelectedNodeProps = Pick<IAMNodeProps, 'id' | 'type' | 'description'>;

interface IAMNodeContextState {
  selectedNode: SelectedNodeProps;
  setSelectedNode: React.Dispatch<React.SetStateAction<SelectedNodeProps>>;
}

const defaultNode: SelectedNodeProps = {
  id: '',
  type: 'dummyNode',
  description: 'Click on a node to view its details',
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
