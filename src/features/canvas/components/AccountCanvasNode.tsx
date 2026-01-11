import { useEffect } from 'react';

import { Box, HStack, Text } from '@chakra-ui/react';
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/solid';
import { Handle, NodeResizeControl, useUpdateNodeInternals } from '@xyflow/react';

import { CanvasStore } from '../stores/canvas-store';
import { TutorialPopover } from '@/components/Popover/TutorialPopover';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAccountNode } from '@/types/iam-node-types';

export interface IAMCanvasNodeProps {
  data: IAMAccountNode['data'];
  id: string;
  height?: number | undefined;
  width?: number | undefined;
}

export const AccountCanvasNode: React.FC<IAMCanvasNodeProps> = ({
  data: { collapsed, label, handles },
  id,
  height: nodeHeight,
  width: nodeWidth,
}) => {
  const toggleCollapse = (): void => {
    CanvasStore.send({
      type: 'toggleAccountCollapse',
      accountId: id,
    });
  };

  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(id);
  }, [collapsed, id, updateNodeInternals]);

  nodeHeight = collapsed ? 80 : nodeHeight;
  nodeWidth = collapsed ? 200 : nodeWidth;

  return (
    <Box
      position='absolute'
      pointerEvents='all'
      height={`${nodeHeight}px`}
      width={`${nodeWidth}px`}
      data-element-id={id}
    >
      <Box
        bg={collapsed ? 'gray.50' : 'whiteAlpha.600'}
        border='2px solid'
        height='100%'
        width='100%'
        borderColor='gray.500'
        borderRadius='lg'
        pointerEvents='all'
      >
        <TutorialPopover elementId={id}>
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

              <Box
                as='button'
                type='button'
                onClick={toggleCollapse}
                position='absolute'
                right={2}
                top={2}
              >
                <ArrowUpRightIcon width={24} height={24} />
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
                  width={16}
                  height={16}
                  style={{ position: 'absolute', left: 28, bottom: 28 }}
                />
              </NodeResizeControl>

              <Box p={2}>
                <Text fontSize='large' fontWeight='700'>
                  {label}
                </Text>

                <HStack spacing={3} position='absolute' right={2} top={2}>
                  <Box as='button' onClick={toggleCollapse}>
                    <ArrowDownLeftIcon width={24} height={24} />
                  </Box>
                </HStack>

                {handles.map(h => (
                  <Handle key={h.id} {...h} />
                ))}
              </Box>
            </>
          )}
        </TutorialPopover>
      </Box>
    </Box>
  );
};
