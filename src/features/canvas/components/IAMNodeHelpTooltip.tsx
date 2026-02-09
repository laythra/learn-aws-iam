import { memo } from 'react';

import { Tooltip, Box } from '@chakra-ui/react';

import AnimatedRedDot from '@/components/AnimatedRedDot';

interface IAMNodeHelpTooltipProps {
  alertMessage: string;
}

/**
 * A tooltip component that displays help information for IAM nodes with an animated red dot indicator.
 *
 * @remarks
 * This component uses absolute positioning to overlay an animated red dot on the top-left corner
 * of its parent container. The tooltip appears on the left side when the user hovers over the dot.  *
 *
 * @param props.alertMessage - The message to display in the tooltip when hovering over the indicator
 *
 * @returns A tooltip with an animated red dot visual indicator
 */
const IAMNodeHelpTooltip: React.FC<IAMNodeHelpTooltipProps> = ({ alertMessage }) => {
  return (
    <Tooltip label={alertMessage} placement='left-start' hasArrow offset={[0, 10]}>
      <Box position='absolute' top={2} left={2} width='15px' height='15px' zIndex={2}>
        <AnimatedRedDot offset={0} />
      </Box>
    </Tooltip>
  );
};

export default memo(IAMNodeHelpTooltip);
