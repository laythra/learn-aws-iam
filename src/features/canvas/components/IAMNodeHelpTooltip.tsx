import { memo } from 'react';

import { Tooltip, Box } from '@chakra-ui/react';

import AnimatedRedDot from '@/components/AnimatedRedDot';
import { usePopover } from '@/runtime/tutorial/usePopover';

interface IAMNodeHelpTooltipProps {
  nodeTooltip: string;
  nodeId: string;
}

/**
 * A tooltip component that displays help information for IAM nodes with an animated red dot indicator.
 * @param props.nodeTooltip - The message to display in the tooltip when hovering over the indicator
 *
 * @returns A tooltip with an animated red dot visual indicator
 *
 * @remarks
 * This component uses absolute positioning to overlay an animated red dot on the top-left corner
 * of its parent container. The tooltip appears on the left side when the user hovers over the dot.
 */
const IAMNodeHelpTooltip: React.FC<IAMNodeHelpTooltipProps> = ({ nodeTooltip, nodeId }) => {
  const { isOpen: isPopoverOpen } = usePopover(nodeId);

  if (isPopoverOpen) {
    return null;
  }

  return (
    <Tooltip label={nodeTooltip} placement='left-start' hasArrow offset={[0, 10]}>
      <Box position='absolute' top={2} left={2} width='15px' height='15px' zIndex={2}>
        <AnimatedRedDot offset={0} />
      </Box>
    </Tooltip>
  );
};

export default memo(IAMNodeHelpTooltip);
