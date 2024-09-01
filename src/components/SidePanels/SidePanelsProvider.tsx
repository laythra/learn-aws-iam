import React, { createContext } from 'react';

import { useBoolean } from '@chakra-ui/react';

interface SidePanelsProviderProps {
  children: React.ReactNode;
}

export type SidePanelsContextState = {
  rightPanelOpen: boolean;
  setRightPanelOpen: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  };
};

export const SidePanelsContext = createContext<SidePanelsContextState>({
  rightPanelOpen: false,
  setRightPanelOpen: { on: () => {}, off: () => {}, toggle: () => {} },
});

const SidePanelProvider: React.FC<SidePanelsProviderProps> = ({ children }) => {
  const [rightPanelOpen, setRightPanelOpen] = useBoolean(false);

  return (
    <SidePanelsContext.Provider
      value={{
        rightPanelOpen,
        setRightPanelOpen,
      }}
    >
      {children}
    </SidePanelsContext.Provider>
  );
};

export default SidePanelProvider;
