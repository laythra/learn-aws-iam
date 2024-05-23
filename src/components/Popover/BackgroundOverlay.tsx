import { Box, useTheme } from '@chakra-ui/react';
interface BackgroundOverlayProps {
  isOpen: boolean;
}

export const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  const theme = useTheme();

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        pointerEvents: 'none',
        zIndex: theme.zIndices.docked - 1, // * Make sure the overlay is behind the popover
      }}
    />
  );
};
