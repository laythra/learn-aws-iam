import React, { createContext, useState } from 'react';

interface IAMNodeContextProps {
  children: React.ReactNode;
}

interface IAMNodeContextState {
  selectedNodeId: string;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string>>;
}

const defaultSelectedNodeId = '-1';

export const IAMNodeContext = createContext<IAMNodeContextState>({
  selectedNodeId: defaultSelectedNodeId,
  setSelectedNodeId: () => {},
});

/*
 * `IAMNodeProvider` provides the selectedNodeId and its setter to the children components.
 */
const IAMNodeProvider: React.FC<IAMNodeContextProps> = ({ children }) => {
  const [selectedNodeId, setSelectedNodeId] = useState(defaultSelectedNodeId);

  return (
    <IAMNodeContext.Provider value={{ selectedNodeId, setSelectedNodeId }}>
      {children}
    </IAMNodeContext.Provider>
  );
};

export default IAMNodeProvider;
