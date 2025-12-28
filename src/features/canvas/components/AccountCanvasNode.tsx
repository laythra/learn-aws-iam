import { useEffect } from 'react';

import { Box, HStack, Text } from '@chakra-ui/react';
import { ArrowDownLeftIcon, ArrowsPointingInIcon } from '@heroicons/react/24/solid';
import { Handle, NodeResizeControl, Position, useUpdateNodeInternals } from '@xyflow/react';

import { CanvasStore } from '../stores/canvas-store';
import { WithPopoverBox } from '@/components/Decorated';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAccountNode } from '@/types/iam-node-types';

export interface IAMCanvasNodeProps {
  data: IAMAccountNode['data'];
  id: string;
}

export const AccountCanvasNode: React.FC<IAMCanvasNodeProps> = ({
  data: { collapsed, label, handles },
  id,
}) => {
  const toggleCollapse = (): void => {
    CanvasStore.send({
      type: 'toggleAccountCollapse',
      accountId: id,
    });
  };

  const aggregateUserNodes = (): void => {
    // levelActor.send({
    //   type: StatelessStateMachineEvent.AggregateUserNodes,
    // });
  };

  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    console.log('Updating node internals for', id);
    updateNodeInternals(id);
  }, [collapsed, id, updateNodeInternals]);

  return (
    <WithPopoverBox data-element-id={id} zIndex={20}>
      {/* stable node wrapper */}
      <Box
        position='absolute'
        width={collapsed ? 120 : '100%'}
        height={collapsed ? 48 : '100%'}
        bg={collapsed ? 'gray.50' : 'whiteAlpha.600'}
        border={collapsed ? '1px dashed' : '2px solid'}
        borderColor='gray.500'
        borderRadius='lg'
        pointerEvents='all'
      >
        <Handle position={Position.Top} id='top' type='target' style={{ pointerEvents: 'all' }} />

        {collapsed && (
          <Box
            height='100%'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            px={3}
          >
            <Text fontSize='sm' fontWeight='600' noOfLines={1}>
              {label}
            </Text>

            <Box as='button' type='button' onClick={toggleCollapse}>
              <ArrowDownLeftIcon width={14} height={14} />
            </Box>
          </Box>
        )}

        {!collapsed && (
          <>
            <NodeResizeControl
              minWidth={100}
              minHeight={50}
              position='bottom-left'
              keepAspectRatio
              shouldResize={(__, { width, height, x, y }) => {
                const accountNodes = CanvasStore.getSnapshot().context.nodes.filter(
                  node => node.id !== id && node.data.entity === IAMNodeEntity.Account
                );

                return !accountNodes.some(node => {
                  const nx = node.position.x;
                  const ny = node.position.y;
                  const nw = node.width!;
                  const nh = node.height!;

                  return (
                    x < nx + nw + 20 &&
                    y < ny + nh + 20 &&
                    nx < x + width + 20 &&
                    ny < y + height + 20
                  );
                });
              }}
              style={{
                background: 'transparent',
                border: 'none',
                height: 44,
                width: 44,
              }}
            >
              <ArrowDownLeftIcon
                width={24}
                height={24}
                style={{ position: 'absolute', left: 28, bottom: 28 }}
              />
            </NodeResizeControl>

            <Box p={2}>
              <Text fontSize='large' fontWeight='700'>
                {label}
              </Text>

              <HStack spacing={1} position='absolute' right={2} top={2}>
                <Box as='button' onClick={aggregateUserNodes}>
                  <ArrowsPointingInIcon width={24} height={24} />
                </Box>
                <Box as='button' onClick={toggleCollapse}>
                  <ArrowDownLeftIcon
                    width={24}
                    height={24}
                    style={{ transform: 'rotate(180deg)' }}
                  />
                </Box>
              </HStack>

              {handles.map(h => (
                <Handle key={h.id} {...h} />
              ))}
            </Box>
          </>
        )}
      </Box>
    </WithPopoverBox>
  );
};
