import { Box, Text } from '@chakra-ui/react';
import { ArrowDownLeftIcon } from '@heroicons/react/24/solid';
import { Handle, NodeResizeControl, Position } from '@xyflow/react';

import { CanvasStore } from '../stores/canvas-store';
import { WithPopoverBox } from '@/components/Decorated';
import { IAMAccountNode, IAMNodeEntity } from '@/types';

export interface IAMCanvasNodeProps {
  data: IAMAccountNode['data'];
  id: string;
}

export const AccountCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  return (
    <>
      <WithPopoverBox data-element-id={id} zIndex={20}>
        <Box
          position='absolute'
          top={0}
          left={0}
          width='100%'
          height='100%'
          bg='whiteAlpha.600'
          border='2px solid'
          borderColor='gray.500'
          borderRadius='lg'
          pointerEvents='all'
        />
        <NodeResizeControl
          minWidth={100}
          minHeight={50}
          position='bottom-left'
          keepAspectRatio
          shouldResize={(__, { width, height, x, y }) => {
            const accountNodes = CanvasStore.getSnapshot().context.nodes.filter(
              node => node.id !== id && node.data.entity === IAMNodeEntity.Account
            );

            if (!accountNodes) return true;

            return !accountNodes.some(node => {
              const nodeX = node.position.x;
              const nodeY = node.position.y;
              const nodeWidth = node.width!;
              const nodeHeight = node.height!;

              return (
                x < nodeX + nodeWidth + 20 &&
                y < nodeY + nodeHeight + 20 &&
                nodeX < x + width + 20 &&
                nodeY < y + height + 20
              );
            });
          }}
          style={{
            color: 'gray',
            background: 'transparent',
            border: 'none',
            height: 44,
            width: 44,
          }}
        >
          <ArrowDownLeftIcon
            width={24}
            height={24}
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              left: 28,
              bottom: 28,
            }}
          />
        </NodeResizeControl>

        <Box position='relative' p={2}>
          <Text fontSize='large' fontWeight='700' position='absolute' left={4}>
            {data.label}
          </Text>
          {data.handles.map(handleProps => (
            <Handle key={handleProps.id} {...handleProps} />
          ))}
          <Handle position={Position.Top} id='top' type='target' style={{ pointerEvents: 'all' }} />
        </Box>
      </WithPopoverBox>
    </>
  );
};
