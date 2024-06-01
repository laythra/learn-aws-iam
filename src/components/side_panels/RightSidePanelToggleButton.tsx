import { useContext } from 'react';

import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { Button } from '@chakra-ui/react';

import { SidePanelsContext } from './SidePanelsProvider';

interface SidePanelToggleButtonProps {}

const SidePanelToggleButton: React.FC<SidePanelToggleButtonProps> = () => {
  const { rightPanelOpen, setRightPanelOpen } = useContext(SidePanelsContext);

  const icon = rightPanelOpen ? <CaretRightOutlined /> : <CaretLeftOutlined />;

  return (
    <Button
      position='fixed'
      top='50%'
      right={rightPanelOpen ? '300px' : '0px'}
      transform='translateY(-50%)'
      colorScheme='gray'
      variant='ghost'
      onClick={setRightPanelOpen.toggle}
    >
      {icon}
    </Button>
  );
};

export default SidePanelToggleButton;
