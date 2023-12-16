import { UserOutlined } from '@ant-design/icons';
import SidePanel from 'components/side_panels/SidePanel';
import IAMSidePanelNode from 'components/nodes/IAMSidePanelNode';
import { Grid } from '@chakra-ui/react';

export default function LeftSidePanel() {
  return (
    <SidePanel alignment='left'>
      <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }} gap={6}>
        <IAMSidePanelNode label='I dont want to be the one' icon={UserOutlined} iconName='UserOutlined' />
        <IAMSidePanelNode label='The battles always choose' icon={UserOutlined} iconName='UserOutlined' />
        <IAMSidePanelNode label='IAM breaking the habit' icon={UserOutlined} iconName='UserOutlined' />
        <IAMSidePanelNode label='tonight' icon={UserOutlined} iconName='UserOutlined' />
      </Grid>
    </SidePanel>
  );
}
