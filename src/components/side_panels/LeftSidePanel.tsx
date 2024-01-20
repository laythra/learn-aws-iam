import { Grid, Flex, Text, GridItem } from '@chakra-ui/react';
import NewEntityButton from 'components/NewEntityButton';
import IAMSidePanelNode from 'components/nodes/IAMSidePanelNode';
import SidePanel from 'components/side_panels/SidePanel';
import { IAMNodeClass } from 'types';

interface LeftSidePanelProps {}

const LeftSidePanel: React.FC<LeftSidePanelProps> = () => {
  return (
    <SidePanel alignment='left'>
      <Flex flexDirection='column' justifyContent='left' m={2}>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text fontSize='xl' fontWeight='bold'>
            LEVEL 4/10
          </Text>
          <NewEntityButton />
        </Flex>
        <Text> PADDING TEXT </Text>
      </Flex>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }} gap={6} padding={4}>
        {new Array(10).fill(0).map((_, i) => {
          return (
            <GridItem key={i}>
              <IAMSidePanelNode
                id={i.toString()}
                iamNodeClass={IAMNodeClass.User}
                label={`test${i}`}
                description={`A sample description for Test node ${i}`}
              />
            </GridItem>
          );
        })}
      </Grid>
    </SidePanel>
  );
};

export default LeftSidePanel;
