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
  Box,
} from '@chakra-ui/react';
import { CheckBadgeIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import _ from 'lodash';
import Markdown from 'react-markdown';

import SidePanelObjectiveHintButton from './SidePanelObjectiveHintButton';
import { useLevelSelector } from '@/app_shell/runtime/level-runtime';
import { TutorialPopover } from '@/app_shell/tutorial/TutorialPopover';
import SidePanel from '@/components/SidePanel';
import { ElementID } from '@/config/element-ids';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { customMarkdownComponents } from '@/lib/markdown/Components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';

const ObjectivesSidePanel: React.FC = () => {
  const [levelObjectives, isSidePanelOpen, levelDescription] = useLevelSelector(
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
          <TutorialPopover elementId={ElementID.ObjectivesSidePanel}>
            <Box mt={2} overflowY='auto' data-element-id={ElementID.ObjectivesSidePanel}>
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
                        <Markdown
                          components={customMarkdownComponents}
                          rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
                        >
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
            </Box>
          </TutorialPopover>
        </Flex>
      </Flex>
    </SidePanel>
  );
};

export default ObjectivesSidePanel;
