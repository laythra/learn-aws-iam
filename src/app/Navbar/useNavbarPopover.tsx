import { createContext, useContext, useState, ReactNode } from 'react';

type NavbarPopoverKey = 'restart-level' | 'checkpoint-help' | 'checkpoint-confirm' | 'level-picker';

type NavbarPopoverContextType = {
  activePopover: NavbarPopoverKey | null;
  openPopover: (key: NavbarPopoverKey) => void;
  closePopover: (key: NavbarPopoverKey) => void;
};
const NavbarPopoverContext = createContext<NavbarPopoverContextType | null>(null);

export const NavbarPopoverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePopover, setActivePopover] = useState<NavbarPopoverKey | null>(null);

  const openPopover = (key: NavbarPopoverKey): void => {
    setActivePopover(key);
  };

  const closePopover = (key: NavbarPopoverKey): void => {
    setActivePopover(prev => (prev === key ? null : prev));
  };

  return (
    <NavbarPopoverContext.Provider value={{ activePopover, openPopover, closePopover }}>
      {children}
    </NavbarPopoverContext.Provider>
  );
};

export const useNavbarPopover = (
  key: NavbarPopoverKey
): { isOpen: boolean; onOpen: () => void; onClose: () => void } => {
  const context = useContext(NavbarPopoverContext);

  if (!context) {
    throw new Error('useNavbarPopover must be used within NavbarPopoverProvider');
  }

  const { activePopover, openPopover, closePopover } = context;

  return {
    isOpen: activePopover === key,
    onOpen: () => openPopover(key),
    onClose: () => closePopover(key),
  };
};
