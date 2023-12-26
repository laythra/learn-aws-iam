import { UserOutlined } from '@ant-design/icons';
import { Grid } from '@chakra-ui/react';
import IAMSidePanelNode from 'components/nodes/IAMSidePanelNode';
import SidePanel from 'components/side_panels/SidePanel';

export default function LeftSidePanel() {
  return (
    <SidePanel alignment='left'>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
        gap={6}
      >
        {new Array(10).fill(0).map((_, i) => {
          return (
            <IAMSidePanelNode
              label={`test${i}`}
              icon={UserOutlined}
              iconName='UserOutlined'
              id='1'
              type='userNode'
              description={`A sample description for Test node ${i}`}
            />
          );
        })}
      </Grid>
    </SidePanel>
  );
}
