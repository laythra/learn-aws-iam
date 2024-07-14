import { Text, Flex, Divider, Box, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/20/solid';

import { LevelsProgressionContext } from '../levels_progression/LevelsProgressionProvider';
import SidePanel from '@/components/side_panels/SidePanel';

const RightSidePanel: React.FC = () => {
  const levelObjectives = LevelsProgressionContext.useSelector(
    state => state.context.level_objectives
  );

  return (
    <SidePanel alignment='right'>
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
          <Box mt={2} overflowY='auto'>
            <List spacing={3}>
              {Object.values(levelObjectives).map((objective, index) => {
                return (
                  <ListItem key={index}>
                    <ListIcon
                      w={5}
                      h={5}
                      as={objective.finished ? CheckBadgeIcon : XCircleIcon}
                      color={objective.finished ? 'green.500' : 'black'}
                    />
                    <Text as={objective.finished ? 's' : 'abbr'}>{objective.label}</Text>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Flex>
      </Flex>
    </SidePanel>
  );
};

export default RightSidePanel;
