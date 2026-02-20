import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  Tooltip,
  type PlacementWithLogical,
} from '@chakra-ui/react';

interface NavbarPopoverButtonProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  placement?: PlacementWithLogical;
  tooltipLabel: string;
  icon: React.ReactElement;
  ariaLabel: string;
  children: React.ReactNode;
}

export const NavbarPopoverButton: React.FC<NavbarPopoverButtonProps> = ({
  isOpen,
  onClose,
  onClick,
  placement = 'bottom-start',
  tooltipLabel,
  icon,
  ariaLabel,
  children,
}) => {
  return (
    <Popover isOpen={isOpen} onClose={onClose} placement={placement}>
      <PopoverTrigger>
        <Box>
          <Tooltip label={tooltipLabel} isDisabled={isOpen}>
            <IconButton
              onClick={onClick}
              icon={icon}
              aria-label={ariaLabel}
              color='gray.600'
              _hover={{ color: 'black' }}
              _active={{ color: 'black' }}
              bg='transparent'
              size='xs'
            />
          </Tooltip>
        </Box>
      </PopoverTrigger>
      {children}
    </Popover>
  );
};
