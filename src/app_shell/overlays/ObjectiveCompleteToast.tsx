import React, { useEffect } from 'react';

import { Box, useToast, HStack, Icon, CloseButton } from '@chakra-ui/react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import Markdown from 'react-markdown';

import { useLevelActor } from '@/components/providers/level-actor-contexts';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { components as markdownComponents } from '@/lib/markdown/components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';

interface ObjectiveCompletePopoverProps {}

export const ObjectiveCompleteToast: React.FC<ObjectiveCompletePopoverProps> = () => {
  const machineActor = useLevelActor();
  const toast = useToast({
    position: 'bottom',
    duration: 4000,
    isClosable: true,
  });

  useEffect(() => {
    const sub = machineActor.on('OBJECTIVE_COMPLETED', ({ message, objective_id }) => {
      toast({
        id: `objective-complete-toast-${objective_id}`,
        render: ({ onClose }) => (
          <Box
            bg='white'
            boxShadow='sm'
            borderRadius='md'
            data-element-id='objective-complete-toast'
            data-objective-id={objective_id}
            borderLeftWidth='3px'
            borderLeftColor='green.400'
            overflow='hidden'
            maxW='360px'
            minW='280px'
            position='relative'
            px={3}
            py={3}
          >
            <CloseButton
              size='sm'
              position='absolute'
              top='8px'
              right='8px'
              onClick={onClose}
              aria-label='close'
            />
            <HStack spacing={2} align='start'>
              <Icon as={CheckBadgeIcon} color='green.500' boxSize={5} mt={0.5} flexShrink={0} />
              <Box flex={1}>
                <Box fontWeight='600' fontSize='14px' color='gray.800' mb={1}>
                  Objective Complete!
                </Box>
                <Box fontSize='13px' color='gray.600'>
                  <Markdown
                    components={markdownComponents}
                    rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
                  >
                    {message}
                  </Markdown>
                </Box>
              </Box>
            </HStack>
          </Box>
        ),
      });
    });

    return sub.unsubscribe;
  }, [machineActor, toast]);

  return null;
};
