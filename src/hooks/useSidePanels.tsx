import { useContext } from 'react';

import {
  SidePanelsContext,
  SidePanelsContextState,
} from '@/components/side_panels/SidePanelsProvider';

const useSidePanels = (): SidePanelsContextState => {
  const context = useContext(SidePanelsContext);
  if (!context) {
    throw new Error('useSidePanels must be used within a SidePanelsProvider');
  }

  return context;
};

export default useSidePanels;
