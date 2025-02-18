import { Text, Flex, Divider, Box, List, ListItem, ListIcon, HStack } from '@chakra-ui/react';
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/20/solid';
import _ from 'lodash';
import Markdown from 'react-markdown';

import SidePanelObjectiveHintButton from './SidePanelObjectiveHintButton';
import { WithPopoverBox } from '../Decorated';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import SidePanel from '@/components/SidePanels/SidePanel';
import { ElementID } from '@/config/element-ids';
import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components } from '@/utils/markdown/components';

const RightSidePanel: React.FC = () => {
  const [levelObjectives, isSidePanelOpen] = LevelsProgressionContext().useSelector(
    state => [state.context.level_objectives, state.context.side_panel_open],
    _.isEqual
  );

  return (
    <SidePanel isOpen={isSidePanelOpen ?? false}>
      <Flex direction='column' alignItems='center' justifyContent='center' height='100vh'>
        <Flex direction='column' alignItems='center' height='25%'>
          <Text fontSize='lg' fontWeight='bold' p={1}>
            Level Objective
          </Text>

          <Divider my={2} />
          <Box mt={2} overflowY='auto'>
            <Text>
              This levels objective is to create a simple IAM user and attach a policy to it
            </Text>
          </Box>
        </Flex>

        <Flex direction='column' alignItems='center' height='75%' marginTop={4} width='100%'>
          <Text fontSize='lg' fontWeight='bold' p={1}>
            Level Progress
          </Text>
          <Divider my={2} />
          <WithPopoverBox mt={2} overflowY='auto' elementid={ElementID.ObjectivesSidePanel}>
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
                      <Markdown components={components} rehypePlugins={[remarkChakra]}>
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
