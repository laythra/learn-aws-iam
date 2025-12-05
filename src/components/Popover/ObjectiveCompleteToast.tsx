import React, { useEffect } from 'react';

import { Box, useToast, HStack, Icon } from '@chakra-ui/react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import Markdown from 'react-markdown';

import { LevelsProgressionContext } from '../providers/level-actor-contexts';
import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components as markdownComponents } from '@/utils/markdown/components';

interface ObjectiveCompletePopoverProps {}

export const ObjectiveCompleteToast: React.FC<ObjectiveCompletePopoverProps> = () => {
  const machineActor = LevelsProgressionContext().useActorRef();
  const toast = useToast({
    position: 'top-left',
    duration: 6000,
    isClosable: true,
    id: 'objective-complete-toast',
  });

  useEffect(() => {
    const sub = machineActor.on('OBJECTIVE_COMPLETED', ({ message, objective_id }) => {
      toast({
        render: ({ onClose }) => (
          <Box
            bg='white'
            boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'
            borderRadius='lg'
            data-element-id='objective-complete-toast'
            data-objective-id={objective_id}
            borderLeftWidth='4px'
            borderLeftColor='green.400'
            overflow='hidden'
            minW='400px'
            position='relative'
          >
            <Box px={5} py={4}>
              <HStack spacing={3} align='start'>
                <Icon as={CheckBadgeIcon} color='green.500' boxSize={6} mt={0.5} flexShrink={0} />
                <Box flex={1}>
                  <Box fontWeight='600' fontSize='16px' color='gray.800' mb={2}>
                    Objective Complete!
                  </Box>
                  <Box fontSize='14px' color='gray.600'>
                    <Markdown components={markdownComponents} rehypePlugins={[remarkChakra]}>
                      {message}
                    </Markdown>
                  </Box>
                </Box>
                <Box
                  as='button'
                  onClick={onClose}
                  fontSize='22px'
                  color='gray.400'
                  _hover={{ color: 'gray.600' }}
                  flexShrink={0}
                  lineHeight={1}
                  ml={2}
                >
                  ×
                </Box>
              </HStack>
            </Box>
          </Box>
        ),
      });
    });

    return sub.unsubscribe;
  }, [machineActor, toast]);

  return null;
};
