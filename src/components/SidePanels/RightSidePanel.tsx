import {
  Text,
  Flex,
  Divider,
  List,
  ListItem,
  ListIcon,
  HStack,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react';
import { CheckBadgeIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import _ from 'lodash';
import Markdown from 'react-markdown';

import SidePanelObjectiveHintButton from './SidePanelObjectiveHintButton';
import { WithPopoverBox } from '../Decorated';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import SidePanel from '@/components/SidePanels/SidePanel';
import { ElementID } from '@/config/element-ids';
import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components as markdownComponents } from '@/utils/markdown/components';

const RightSidePanel: React.FC = () => {
  const [levelObjectives, isSidePanelOpen, levelDescription] =
    LevelsProgressionContext().useSelector(
      state => [
        state.context.level_objectives,
        state.context.side_panel_open,
        state.context.level_description,
      ],
      _.isEqual
    );

  return (
    <SidePanel isOpen={isSidePanelOpen ?? false}>
      <Flex direction='column' alignItems='center' justifyContent='center' height='100vh'>
        <Flex direction='column' alignItems='center' width='100%' overflowY='auto' flex={1}>
          <HStack alignItems='center'>
            <Text fontSize='lg' fontWeight='bold' p={1}>
              Level Progress
            </Text>
            <Popover>
              <PopoverTrigger>
                <IconButton
                  icon={<InformationCircleIcon />}
                  aria-label='info-button'
                  size='xs'
                  bg='transparent'
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader fontWeight='bold'>Level Objective</PopoverHeader>
                <PopoverBody color='gray.600' fontWeight='semibold'>
                  {levelDescription}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>
          <Divider my={2} />
          <WithPopoverBox mt={2} overflowY='auto' data-element-id={ElementID.ObjectivesSidePanel}>
            <List spacing={3}>
              {Object.values(levelObjectives).map((objective, index) => {
                return (
                  <ListItem key={index}>
                    <HStack alignItems='center'>
                      <ListIcon
                        w={5}
                        h={5}
                        as={objective.finished ? CheckBadgeIcon : XCircleIcon}
                        color={objective.finished ? 'green.500' : 'black'}
                        verticalAlign='top'
                      />
                      <Markdown components={markdownComponents} rehypePlugins={[remarkChakra]}>
                        {objective.label}
                      </Markdown>
                      {objective.hint_text && (
                        <SidePanelObjectiveHintButton hint={objective.hint_text} />
                      )}
                    </HStack>
                  </ListItem>
                );
              })}
            </List>
          </WithPopoverBox>
        </Flex>
      </Flex>
    </SidePanel>
  );
};

export default RightSidePanel;
