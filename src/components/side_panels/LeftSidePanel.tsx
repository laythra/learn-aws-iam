import { UserOutlined } from '@ant-design/icons';
import { Grid, Box, Text, GridItem } from '@chakra-ui/react';
import IAMSidePanelNode from 'components/nodes/IAMSidePanelNode';
import SidePanel from 'components/side_panels/SidePanel';

const LeftSidePanel: React.FC = () => {
  return (
    <SidePanel alignment='left'>
      <Box display='flex' justifyContent='left' m={4}>
        <Text fontSize='xl' fontWeight='bold'>
          LEVEL 4/10
        </Text>
      </Box>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }} gap={6} padding={4}>
        {new Array(10).fill(0).map((_, i) => {
          return (
            <GridItem key={i}>
              <IAMSidePanelNode
                id={i.toString()}
                label={`test${i}`}
                icon={UserOutlined}
                iconName='UserOutlined'
                type='userNode'
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
