import React, { useEffect, useState, useRef } from 'react';

import { Box, Tooltip, TooltipProps } from '@chakra-ui/react';

interface HoverTooltipProps extends Omit<TooltipProps, 'isOpen' | 'defaultIsOpen'> {
  openDelay?: number;
  openOnMount?: boolean;
  initialOpenDelay?: number;
}

const HoverTooltip: React.FC<HoverTooltipProps> = ({
  children,
  openDelay = 0,
  openOnMount = false,
  initialOpenDelay = 0,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!openOnMount) return;
    timerRef.current = setTimeout(() => setIsOpen(true), initialOpenDelay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleMouseEnter = (): void => {
    timerRef.current = setTimeout(() => setIsOpen(true), openDelay);
  };

  const handleMouseLeave = (): void => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOpen(false);
  };

  return (
    <Tooltip {...props} isOpen={isOpen}>
      <Box display='inline-flex' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </Box>
    </Tooltip>
  );
};

export default HoverTooltip;
