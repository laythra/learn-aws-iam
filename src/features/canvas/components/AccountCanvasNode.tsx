import { Box, Text } from '@chakra-ui/react';
import { Handle, Position } from '@xyflow/react';

import { WithPopoverBox } from '@/components/Decorated';
import { IAMAccountNode } from '@/types';

export interface IAMCanvasNodeProps {
  data: IAMAccountNode['data'];
  id: string;
}

export const AccountCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  return (
    <WithPopoverBox elementid={id}>
      <Box width='800px' height='300px'>
        <Box
          position='absolute'
          top={0}
          left={0}
          width='100%'
          height='100%'
          bg='whiteAlpha.600'
          border='2px solid'
          borderColor='gray.300'
          borderRadius='md'
          pointerEvents='all'
          zIndex={1}
        />
        <Box position='relative' zIndex={2} p={2}>
          <Text fontSize='large' fontWeight='700' position='absolute' left={4}>
            {data.label}
          </Text>
          {data.handles.map(handleProps => (
            <Handle key={handleProps.id} {...handleProps} />
          ))}
          <Handle position={Position.Top} id='top' type='target' style={{ pointerEvents: 'all' }} />
        </Box>
      </Box>
    </WithPopoverBox>
  );
};
