import { ComponentType, SVGProps } from 'react';

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
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconSize?: number;
  ariaLabel: string;
  children: React.ReactNode;
}

export const NavbarPopoverButton: React.FC<NavbarPopoverButtonProps> = ({
  isOpen,
  onClose,
  onClick,
  placement = 'bottom-start',
  tooltipLabel,
  icon: IconComponent,
  iconSize = 24,
  ariaLabel,
  children,
}) => {
  return (
    <Popover isOpen={isOpen} onClose={onClose} placement={placement} variant='elevated'>
      <PopoverTrigger>
        <Box>
          <Tooltip label={tooltipLabel} isDisabled={isOpen}>
            <IconButton
              onClick={onClick}
              icon={<IconComponent width={iconSize} height={iconSize} />}
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
