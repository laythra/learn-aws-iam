import React from 'react';

import { Button, useTheme } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { CustomTheme } from '@/types/custom-theme';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

const MotionButton = motion(Button);

export const HelpButton: React.FC = () => {
  const theme = useTheme<CustomTheme>();
  const machineActor = LevelsProgressionContext().useActorRef();

  const showHelpPopover = (): void => {
    machineActor.send({ type: StatelessStateMachineEvent.ShowHelpPopover });
  };

  const helpTips = machineActor.getSnapshot().context.help_tips ?? [];

  // We should probably never have an empty help tips array, but just in case
  // we return null to avoid rendering the button
  if (helpTips.length === 0) {
    return null;
  }

  return (
    <MotionButton
      colorScheme='gray'
      size='sm'
      px={4}
      py={2}
      bg='black'
      zIndex={theme.zIndices.docked}
      color='gray.100'
      _hover={{ bg: 'gray.800' }}
      position='fixed'
      top={theme.sizes.navbarHeightInPixels + 6}
      left={1}
      initial={{ boxShadow: '0 0 0px 0px rgba(74, 85, 104,0.9)' }}
      animate={{
        boxShadow: [
          '0 0 0px 0px rgba(74, 85, 104,0.9)',
          '0 0 20px 0px rgba(74, 85, 104,1)',
          '0 0 0px 0px rgba(74, 85, 104,0.9)',
        ],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatDelay: 2,
      }}
      onClick={showHelpPopover}
    >
      Show Help
    </MotionButton>
  );
};
