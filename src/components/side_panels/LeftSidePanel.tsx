import { Grid, Flex, Text, GridItem, Box } from '@chakra-ui/react';
import _ from 'lodash';

import { LevelsProgressionContext } from '@/components/levels_progression/LevelsProgressionProvider'; // eslint-disable-line
import IAMSidePanelNode from '@/components/nodes/IAMSidePanelNode';
import SidePanel from '@/components/side_panels/SidePanel';
import { NewEntityButton } from '@/features/iam_entities';
import { useIAMNodesManager } from '@/hooks/useIAMNodesManager';

interface LeftSidePanelProps {}

const LeftSidePanel: React.FC<LeftSidePanelProps> = () => {
  const { createdNodes } = useIAMNodesManager();
  const stateContext = LevelsProgressionContext.useSelector(state => state);

  return (
    <SidePanel alignment='left'>
      <Box overflowY='auto' height='100vh' paddingBottom={4}>
        <Flex flexDirection='column' justifyContent='left' m={2}>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text fontSize='xl' fontWeight='bold'>
              LEVEL {stateContext.context.level_number} / {stateContext.context.total_levels}
            </Text>
            <NewEntityButton />
          </Flex>
          <Text> PADDING TEXT </Text>
        </Flex>
        {_.isEmpty(createdNodes) && (
          <Flex justifyContent='center' alignItems='center' height='100%'>
            <Text fontSize='lg' fontWeight='bold'>
              No nodes created yet.
            </Text>
          </Flex>
        )}

        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
          gap={6}
          padding={4}
        >
          {createdNodes.map(({ id, entity, label, description, content }) => {
            return (
              <GridItem key={id}>
                <IAMSidePanelNode
                  id={id}
                  entity={entity}
                  label={label}
                  description={description}
                  content={content}
                />
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    </SidePanel>
  );
};

export default LeftSidePanel;
