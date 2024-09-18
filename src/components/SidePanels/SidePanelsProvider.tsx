import React, { createContext, useRef } from 'react';

interface SidePanelsProviderProps {
  children: React.ReactNode;
}

export type SidePanelsContextState = {
  ref: React.RefObject<HTMLDivElement> | null;
};

export const SidePanelsContext = createContext<SidePanelsContextState>({
  ref: null,
});

// I am not sure if I should store the ref in the context or inside the statemachine
// This will do for now
const SidePanelProvider: React.FC<SidePanelsProviderProps> = ({ children }) => {
  const sidePanelRef = useRef<HTMLDivElement>(null);

  return (
    <SidePanelsContext.Provider
      value={{
        ref: sidePanelRef,
      }}
    >
      {children}
    </SidePanelsContext.Provider>
  );
};

export default SidePanelProvider;
