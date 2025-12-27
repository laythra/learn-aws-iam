import React from 'react';

import {
  HStack,
  Image,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  Portal,
  Text,
  useTheme,
  VStack,
} from '@chakra-ui/react';
import _ from 'lodash';

import { HelpImage } from './HelpImage';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { HelpTip } from '@/machines/types/context-types';
import { CustomTheme } from '@/types/custom-theme';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';
import { loadLocalImage } from '@/utils/image-loader';

interface HelpPopover {}

// TODO: Add more help tips as needed
const HelpPopoverItemsMap = {
  ConnectNodes: {
    title: 'Connect Nodes',
    description: 'You can connect nodes by dragging from any handle to another node',
    icon_path: 'link',
    image_path: 'connecting-nodes',
  },
  CreatePolicies: {
    title: 'Create Policies & Roles',
    description:
      'Click the "Create" button in the top right corner to choose and create a policy or role.',
    icon_path: 'policy',
    image_path: 'creating-policies',
  },
} as const satisfies Record<HelpTip, object>;

export const HelpPopover: React.FC<HelpPopover> = () => {
  const theme = useTheme<CustomTheme>();
  const machineActor = LevelsProgressionContext().useActorRef();
  const [showHelpPopover] = LevelsProgressionContext().useSelector(
    state => [state.context.show_help_popover],
    _.isEqual
  );

  const [selectedTip, setSelectedTip] = React.useState<HelpTip | null>(null);
  const selectedTipInfo = selectedTip ? HelpPopoverItemsMap[selectedTip] : null;
  const helpTips = machineActor.getSnapshot().context.help_tips ?? [];

  const hideHelpPopover = (): void => {
    machineActor.send({ type: StatelessStateMachineEvent.HideHelpPopover });
    setSelectedTip(null);
  };

  return (
    <Portal>
      <Popover isOpen={showHelpPopover} closeOnBlur={true}>
        <PopoverContent position='fixed' top={theme.sizes.navbarHeightInPixels + 6} left={1}>
          <PopoverHeader fontWeight='semibold' borderBottomWidth={1} fontSize='16px'>
            <HStack>
              <Text>{selectedTipInfo ? selectedTipInfo.title : 'Helpful Tips'}</Text>
            </HStack>
          </PopoverHeader>
          <PopoverBody mt={2}>
            {!selectedTip &&
              helpTips.map(helpTip => (
                <HStack
                  key={helpTip}
                  as='button'
                  alignItems='center'
                  mb={2}
                  cursor='pointer'
                  _hover={{ bg: 'gray.100', borderRadius: '8px' }}
                  onClick={() => setSelectedTip(helpTip)}
                  w='100%'
                  p={2}
                  border={'1px solid transparent'}
                >
                  <Image
                    src={loadLocalImage(HelpPopoverItemsMap[helpTip].icon_path)}
                    h='20px'
                    w='20px'
                  />
                  <Text fontWeight='semibold'>{HelpPopoverItemsMap[helpTip].title}</Text>
                </HStack>
              ))}

            {selectedTipInfo && (
              <VStack alignItems='flex-start' spacing={2} mb={2} cursor='pointer'>
                {selectedTipInfo.description && (
                  <Text fontSize='md'>{selectedTipInfo.description}</Text>
                )}
                <HelpImage imagePath={selectedTipInfo.image_path} />
              </VStack>
            )}
          </PopoverBody>
          <PopoverCloseButton onClick={hideHelpPopover} />
        </PopoverContent>
      </Popover>
    </Portal>
  );
};
