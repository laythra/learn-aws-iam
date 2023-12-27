import React, { createContext } from 'react';

import { useSidePanels } from 'hooks/useSidePanels';

interface SidePanelsProviderProps {
  children: React.ReactNode;
}

export const SidePanelsContext = createContext({
  leftPanelOpen: false,
  setLeftPanelOpen: { on: () => {}, off: () => {}, toggle: () => {} },
  rightPanelOpen: false,
  setRightPanelOpen: { on: () => {}, off: () => {}, toggle: () => {} },
});

const SidePanelProvider: React.FC<SidePanelsProviderProps> = ({ children }) => {
  const { leftPanelOpen, rightPanelOpen, setLeftPanelOpen, setRightPanelOpen } = useSidePanels();

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
