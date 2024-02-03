import { Grid, Flex, Text, GridItem, Box } from '@chakra-ui/react';
import NewEntityButton from 'components/NewEntityButton';
import IAMSidePanelNode from 'components/nodes/IAMSidePanelNode';
import SidePanel from 'components/side_panels/SidePanel';
import useIAMEntities from 'hooks/useIAMEntities';

interface LeftSidePanelProps {}

const LeftSidePanel: React.FC<LeftSidePanelProps> = () => {
  const { createdNodes } = useIAMEntities();

  return (
    <SidePanel alignment='left'>
      <Box overflowY='auto' height='100vh' paddingBottom={4}>
        <Flex flexDirection='column' justifyContent='left' m={2}>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text fontSize='xl' fontWeight='bold'>
              LEVEL 4/10
            </Text>
            <NewEntityButton />
          </Flex>
          <Text> PADDING TEXT </Text>
        </Flex>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
          gap={6}
          padding={4}
        >
          {createdNodes.map(node => {
            return (
              <GridItem key={node.id}>
                <IAMSidePanelNode
                  id={node.id}
                  entity={node.entity}
                  label={node.label}
                  description={node.description}
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
