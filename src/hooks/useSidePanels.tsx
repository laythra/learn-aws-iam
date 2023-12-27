import { useBoolean } from '@chakra-ui/react';

type SidePanelsState = {
  leftPanelOpen: boolean;
  setLeftPanelOpen: { on: () => void; off: () => void; toggle: () => void };
  rightPanelOpen: boolean;
  setRightPanelOpen: { on: () => void; off: () => void; toggle: () => void };
};

export const useSidePanels = (): SidePanelsState => {
  const [leftPanelOpen, setLeftPanelOpen] = useBoolean(true);
  const [rightPanelOpen, setRightPanelOpen] = useBoolean(true);

  return { leftPanelOpen, setLeftPanelOpen, rightPanelOpen, setRightPanelOpen };
};
