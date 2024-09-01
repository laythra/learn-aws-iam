import React, { createContext } from 'react';

import { useBoolean } from '@chakra-ui/react';

interface SidePanelsProviderProps {
  children: React.ReactNode;
}

export type SidePanelsContextState = {
  leftPanelOpen: boolean;
  setLeftPanelOpen: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  };
  rightPanelOpen: boolean;
  setRightPanelOpen: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  };
};

export const SidePanelsContext = createContext<SidePanelsContextState>({
  leftPanelOpen: false,
  setLeftPanelOpen: { on: () => {}, off: () => {}, toggle: () => {} },
  rightPanelOpen: false,
  setRightPanelOpen: { on: () => {}, off: () => {}, toggle: () => {} },
});

const SidePanelProvider: React.FC<SidePanelsProviderProps> = ({ children }) => {
  const [leftPanelOpen, setLeftPanelOpen] = useBoolean(false);
  const [rightPanelOpen, setRightPanelOpen] = useBoolean(false);

  return (
    <SidePanelsContext.Provider
      value={{
        leftPanelOpen,
        rightPanelOpen,
        setLeftPanelOpen,
        setRightPanelOpen,
      }}
    >
      {children}
    </SidePanelsContext.Provider>
  );
};

export default SidePanelProvider;
