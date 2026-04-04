import React, { useEffect } from 'react';

import { Box, useToast, HStack, Icon, CloseButton } from '@chakra-ui/react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import Markdown from 'react-markdown';

import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { customMarkdownComponents } from '@/lib/markdown/Components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';
import { useLevelActor } from '@/runtime/level-runtime';

export const ObjectiveCompleteToast: React.FC = () => {
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
            bg='green.50'
            boxShadow='lg'
            borderRadius='lg'
            data-element-id='objective-complete-toast'
            data-objective-id={objective_id}
            maxW='360px'
            minW='280px'
            position='relative'
            px={4}
            py={4}
          >
            <CloseButton
              size='sm'
              position='absolute'
              top='10px'
              right='10px'
              onClick={onClose}
              aria-label='close'
              color='green.800'
            />
            <HStack spacing={3} align='start'>
              <Box
                bg='green.600'
                borderRadius='full'
                boxSize={8}
                display='flex'
                alignItems='center'
                justifyContent='center'
                flexShrink={0}
              >
                <Icon as={CheckBadgeIcon} color='white' boxSize={5} />
              </Box>
              <Box flex={1} pr={4}>
                <Box fontWeight='700' fontSize='14px' color='green.900' mb={0.5}>
                  Objective Complete!
                </Box>
                <Box fontSize='13px' color='green.800'>
                  <Markdown
                    components={customMarkdownComponents}
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
